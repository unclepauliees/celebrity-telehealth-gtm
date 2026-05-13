<script setup lang="ts">
/**
 * WebGLCanvas
 *
 * Mounts the Three.js WebGLRenderer into #webgl-canvas-mount (already in the DOM
 * via layouts/default.vue). Single persistent renderer — never unmounted while
 * the app is running.
 *
 * Responsibilities:
 * - Create the WebGLRenderer with alpha:true, antialias:true
 * - Set background to Obsidian Black (Three.js requires raw hex — documented exception)
 * - Cap pixel ratio at 2
 * - Append the renderer's canvas element into #webgl-canvas-mount
 * - Call useScrollScene() to start the scroll-driven render loop
 * - Dev-only FPS counter via import.meta.dev
 * - If prefers-reduced-motion: render one static frame only (no loop)
 *
 * NOTE: Three.js setClearColor uses raw hex 0x0A0A0A (Obsidian Black).
 * This is the documented exception to the no-raw-hex rule — Three.js Color API
 * requires numeric hex values. All CSS in this component uses token variables.
 */

// Dev-only FPS state
const fps = ref(0)
const isDev = import.meta.dev

// Reduced motion check
const reducedMotion = useReducedMotion()

// Scroll scene controller
let scrollSceneDispose: (() => void) | null = null

// FPS tracking state
let fpsFrameCount = 0
let fpsLastTime = 0

onMounted(async () => {
  const mountEl = document.getElementById('webgl-canvas-mount')
  if (!mountEl) {
    console.error('WebGLCanvas: #webgl-canvas-mount not found in DOM')
    return
  }

  // Dynamic import — hits the 'three' Vite chunk (lazy, client-only)
  const THREE = await import('three')

  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })

  // Raw hex — Three.js Color API requires numeric hex (documented exception)
  renderer.setClearColor(0x0A0A0A, 1)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(mountEl.offsetWidth || window.innerWidth, mountEl.offsetHeight || window.innerHeight)

  // Ensure the canvas fills its mount container
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'

  mountEl.appendChild(renderer.domElement)

  if (reducedMotion.value) {
    // Reduced motion: render a single static frame — no loop, no scene loading
    // The renderer is mounted (visible background) but the rAF loop never starts
    const staticScene = new THREE.Scene()
    const staticCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100)
    staticCamera.position.set(0, 0, 6)
    staticCamera.lookAt(0, 0, 0)
    renderer.render(staticScene, staticCamera)
    return
  }

  // Start the scroll scene
  const { camera: sceneCamera, dispose } = useScrollScene(renderer)
  scrollSceneDispose = dispose

  // Expose camera for ScenePin via shared composable
  watch(sceneCamera, (cam) => {
    setSceneCamera(cam)
  }, { immediate: true })

  // Dev FPS counter
  if (isDev) {
    startFpsCounter()
  }
})

onUnmounted(() => {
  scrollSceneDispose?.()
  scrollSceneDispose = null
})

// ---------------------------------------------------------------------------
// Dev FPS counter — only active in development
// ---------------------------------------------------------------------------

function startFpsCounter(): void {
  if (!isDev) return

  let rafId = 0

  const tick = (timestamp: number) => {
    fpsFrameCount++

    if (fpsLastTime === 0) {
      fpsLastTime = timestamp
    }

    // Update every 30 frames
    if (fpsFrameCount % 30 === 0) {
      const elapsed = timestamp - fpsLastTime
      if (elapsed > 0) {
        fps.value = Math.round((30 / elapsed) * 1000)
      }
      fpsLastTime = timestamp
    }

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
  })
}
</script>

<template>
  <!-- WebGLCanvas renders into #webgl-canvas-mount via onMounted DOM manipulation.
       This component itself is a zero-size element — the actual canvas lives in the mount div.
       Dev FPS counter is overlaid in bottom-left when import.meta.dev is true. -->
  <div class="webgl-canvas-root" aria-hidden="true">
    <div
      v-if="isDev"
      class="webgl-fps"
      aria-hidden="true"
    >
      {{ fps }} fps
    </div>
  </div>
</template>

<style scoped>
/* This component itself has no visual footprint.
   The Three.js canvas is injected directly into #webgl-canvas-mount in the layout. */
.webgl-canvas-root {
  position: fixed;
  bottom: var(--space-2);
  left: var(--space-2);
  z-index: 9000;
  pointer-events: none;
}

/* Dev-only FPS counter — Space Mono, gold, 60% opacity
   Spec says 14px — maps to --text-data token */
.webgl-fps {
  font-family: var(--font-mono);
  font-size: var(--text-data);
  color: var(--color-gold);
  opacity: 0.6;
  line-height: 1;
  letter-spacing: var(--tracking-label);
  user-select: none;
}
</style>
