<script setup lang="ts">
/**
 * ScenePreloader
 *
 * Full-viewport loading screen shown while GLB scenes download.
 * Tracks loading progress with a percentage counter.
 *
 * - Space Mono font via var(--font-mono) token
 * - Progress display: "LOADING — 00%" (counts up to 100%)
 * - Attempts real byte-progress tracking via fetch + ReadableStream
 * - Falls back to a simulated 2-second ramp if content-length is unavailable
 * - Fades out when complete, then unmounts
 * - Background: var(--color-obsidian)
 * - Text: var(--color-gold)
 * - No spinner — percentage counter only
 * - No border-radius, no box-shadow
 */

const emit = defineEmits<{
  complete: []
}>()

// Loading percentage 0–100
const percent = ref(0)
const isVisible = ref(true)
const isFadingOut = ref(false)

// Scene GLB URLs to preload (must match useScrollScene paths)
const base = useRuntimeConfig().app.baseURL.replace(/\/$/, '')
const SCENE_URLS = [
  `${base}/scenes/scene-obsidian.glb`,
  `${base}/scenes/scene-capital-chain.glb`,
  `${base}/scenes/scene-platforms.glb`,
] as const

// Formatted display: zero-padded to 2 digits
const displayPercent = computed(() => {
  return String(Math.floor(percent.value)).padStart(2, '0')
})

onMounted(() => {
  startLoading()
})

async function startLoading(): Promise<void> {
  try {
    await fetchWithProgress(SCENE_URLS)
  } catch {
    // On any error, simulate completion so the page isn't stuck
    percent.value = 100
  }
  complete()
}

async function fetchWithProgress(urls: readonly string[]): Promise<void> {
  // Fetch all scenes and track byte progress
  // We divide the progress budget equally across all files
  const progressPerFile = 100 / urls.length
  let completedFiles = 0

  // Try to get real byte progress; fall back to simulated if ReadableStream
  // or content-length is unavailable
  const results = await Promise.allSettled(
    urls.map(async (url, i) => {
      const fileStart = i * progressPerFile

      try {
        const resp = await fetch(url)
        if (!resp.ok || !resp.body) {
          throw new Error(`Fetch failed: ${resp.status}`)
        }

        const contentLength = resp.headers.get('content-length')
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0

        const reader = resp.body.getReader()
        let received = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          received += value?.length ?? 0

          // Update progress within this file's share
          if (totalBytes > 0) {
            const fileProgress = Math.min(received / totalBytes, 1)
            percent.value = fileStart + fileProgress * progressPerFile
          }
          // If no content-length, progress stays at fileStart until done
        }

        completedFiles++
        percent.value = completedFiles * progressPerFile
      } catch {
        // Fallback: simulate this file's progress over 700ms
        await simulateProgress(fileStart, fileStart + progressPerFile, 700)
        completedFiles++
        percent.value = completedFiles * progressPerFile
      }
    }),
  )

  // Ensure we hit 100%
  percent.value = 100

  // Suppress unused variable warning for results
  void results
}

function simulateProgress(
  from: number,
  to: number,
  durationMs: number,
): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      const t = Math.min(elapsed / durationMs, 1)
      // Ease-out curve for satisfying progress feel
      const eased = 1 - Math.pow(1 - t, 2)
      percent.value = from + (to - from) * eased
      if (t < 1) {
        requestAnimationFrame(tick)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(tick)
  })
}

function complete(): void {
  // Ensure final state
  percent.value = 100

  // Short pause at 100% for visual satisfaction, then fade out
  setTimeout(() => {
    isFadingOut.value = true
    // Wait for CSS transition to finish, then emit and hide
    setTimeout(() => {
      isVisible.value = false
      emit('complete')
    }, 600)
  }, 300)
}
</script>

<template>
  <Transition name="preloader-fade">
    <div
      v-if="isVisible"
      class="scene-preloader"
      :class="{ 'scene-preloader--fading': isFadingOut }"
      role="status"
      aria-live="polite"
      :aria-label="`Loading Obsidian Capital Partners — ${displayPercent} percent`"
    >
      <div class="scene-preloader__inner">
        <span class="scene-preloader__label">LOADING</span>
        <span class="scene-preloader__separator" aria-hidden="true"> — </span>
        <span class="scene-preloader__percent">{{ displayPercent }}%</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.scene-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: var(--color-obsidian);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity var(--duration-section) var(--ease-ocp);
}

.scene-preloader--fading {
  opacity: 0;
  pointer-events: none;
}

.scene-preloader__inner {
  display: flex;
  align-items: baseline;
  gap: 0;
}

/* "LOADING" label */
.scene-preloader__label {
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  font-weight: 400;
  color: var(--color-gold);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  line-height: var(--lh-caption);
}

/* " — " separator */
.scene-preloader__separator {
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  color: var(--color-gold);
  opacity: 0.5;
  line-height: var(--lh-caption);
}

/* "00%" counter */
.scene-preloader__percent {
  font-family: var(--font-mono);
  font-size: var(--text-body-sm);
  font-weight: 400;
  color: var(--color-gold);
  letter-spacing: var(--tracking-label);
  line-height: var(--lh-caption);
  /* Fixed-width so the layout doesn't shift as digits change */
  min-width: 3.5ch;
}

/* Vue Transition fallback — the component also handles its own fade via class */
.preloader-fade-enter-active,
.preloader-fade-leave-active {
  transition: opacity var(--duration-section) var(--ease-ocp);
}
.preloader-fade-enter-from,
.preloader-fade-leave-to {
  opacity: 0;
}

/* Mobile: use --text-eyebrow (10px) instead of --text-body-sm (13px)
   if the display text is too large for narrow viewports.
   Note: --text-eyebrow = 10px — above the 13px Cormorant floor (Space Mono exempt). */
@media (max-width: 767px) {
  .scene-preloader__label,
  .scene-preloader__separator,
  .scene-preloader__percent {
    font-size: var(--text-eyebrow);
  }
}
</style>
