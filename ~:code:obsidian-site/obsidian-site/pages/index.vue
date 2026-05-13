<script setup lang="ts">
/**
 * Homepage — Phase 3 (mobile responsive update)
 *
 * Six-act scroll narrative. Each section registers its theme context with
 * useSectionTheme() so TheNav adapts its wordmark color.
 *
 * All acts use 'dark' theme — WebGL scenes are dark backgrounds.
 *
 * Scroll heights are breakpoint-responsive:
 *   mobile  (<768px)   → 24,000px total
 *   tablet  (768–1023px) → 30,000px total
 *   desktop/wide (≥1024px) → 36,000px total
 *
 * Per-act heights come from useActHeights(). useScrollScene normalizes
 * scrollY against actual document height → logical 36,000px coordinate
 * space so camera paths remain accurate at all breakpoints.
 */

useHead({
  title: 'Obsidian Capital Partners — We Build. We Don\'t Broker.',
  meta: [
    {
      name: 'description',
      content: 'Obsidian Capital Partners is a principal-position institutional capital firm operating in infrastructure and industrial platform companies.',
    },
  ],
})

// Section theme registration
const { registerSection } = useSectionTheme()

// Section element refs — one per act
const act1Ref = ref<HTMLElement | null>(null)
const act2Ref = ref<HTMLElement | null>(null)
const act3Ref = ref<HTMLElement | null>(null)
const act4Ref = ref<HTMLElement | null>(null)
const act5Ref = ref<HTMLElement | null>(null)
const act6Ref = ref<HTMLElement | null>(null)

// All six acts are dark-background (WebGL scenes are dark)
registerSection(act1Ref, 'dark')
registerSection(act2Ref, 'dark')
registerSection(act3Ref, 'dark')
registerSection(act4Ref, 'dark')
registerSection(act5Ref, 'dark')
registerSection(act6Ref, 'dark')

// Reactive scroll heights
const actHeights = useActHeights()

// Compute cumulative scroll start positions for ActLabel ranges
const actStarts = computed(() => {
  const h = actHeights.value
  return {
    act1: 0,
    act2: h.act1,
    act3: h.act1 + h.act2,
    act4: h.act1 + h.act2 + h.act3,
    act5: h.act1 + h.act2 + h.act3 + h.act4,
    act6: h.act1 + h.act2 + h.act3 + h.act4 + h.act5,
  }
})

const actEnds = computed(() => {
  const s = actStarts.value
  const h = actHeights.value
  return {
    act1: s.act1 + h.act1,
    act2: s.act2 + h.act2,
    act3: s.act3 + h.act3,
    act4: s.act4 + h.act4,
    act5: s.act5 + h.act5,
    act6: s.act6 + h.act6,
  }
})
</script>

<template>
  <div>
    <!-- Scene preloader — shown until GLBs are downloaded; self-manages fade-out -->
    <ScenePreloader />

    <!-- WebGL canvas controller — mounts Three.js renderer into #webgl-canvas-mount -->
    <WebGLCanvas />

    <!-- Scroll progress indicator (hidden on mobile via its own CSS) -->
    <ScrollProgress />

    <!-- Mobile scroll hint — first-time scroll prompt, mobile only -->
    <MobileScrollHint />

    <!-- Act labels — one per act, fade in/out based on scroll position -->
    <ActLabel
      number="01"
      title="THE VOID"
      :scroll-start="actStarts.act1"
      :scroll-end="actEnds.act1"
    />
    <ActLabel
      number="02"
      title="EMERGENCE"
      :scroll-start="actStarts.act2"
      :scroll-end="actEnds.act2"
    />
    <ActLabel
      number="03"
      title="THE CAPITAL CHAIN"
      :scroll-start="actStarts.act3"
      :scroll-end="actEnds.act3"
    />
    <ActLabel
      number="04"
      title="PRINCIPALS"
      :scroll-start="actStarts.act4"
      :scroll-end="actEnds.act4"
    />
    <ActLabel
      number="05"
      title="PLATFORMS"
      :scroll-start="actStarts.act5"
      :scroll-end="actEnds.act5"
    />
    <ActLabel
      number="06"
      title="ENGAGE"
      :scroll-start="actStarts.act6"
      :scroll-end="actEnds.act6"
    />

    <!-- Scroll narrative — total height is breakpoint-responsive -->
    <div class="scroll-narrative">

      <!-- Act 1: Obsidian void entry -->
      <section
        ref="act1Ref"
        data-section="act1"
        data-theme="dark"
        class="act act--1"
        aria-label="Act 1 — Obsidian"
        :style="{ height: `${actHeights.act1}px` }"
      />

      <!-- Act 2: Transition: obsidian → capital chain -->
      <section
        ref="act2Ref"
        data-section="act2"
        data-theme="dark"
        class="act act--2"
        aria-label="Act 2 — Transition"
        :style="{ height: `${actHeights.act2}px` }"
      />

      <!-- Act 3: Capital Chain network -->
      <section
        ref="act3Ref"
        data-section="act3"
        data-theme="dark"
        class="act act--3"
        aria-label="Act 3 — Capital Chain"
        :style="{ height: `${actHeights.act3}px` }"
      />

      <!-- Act 4: Transition: capital chain → platforms -->
      <section
        ref="act4Ref"
        data-section="act4"
        data-theme="dark"
        class="act act--4"
        aria-label="Act 4 — Transition"
        :style="{ height: `${actHeights.act4}px` }"
      />

      <!-- Act 5: Platform companies in 3D space -->
      <section
        ref="act5Ref"
        data-section="act5"
        data-theme="dark"
        class="act act--5"
        aria-label="Act 5 — Platforms"
        :style="{ height: `${actHeights.act5}px` }"
      />

      <!-- Act 6: Platforms hold, UI overlay -->
      <section
        ref="act6Ref"
        data-section="act6"
        data-theme="dark"
        class="act act--6"
        aria-label="Act 6 — Hold"
        :style="{ height: `${actHeights.act6}px` }"
      />

    </div>
  </div>
</template>

<style scoped>
/* Scroll narrative container — height driven by per-section inline styles */
.scroll-narrative {
  position: relative;
  z-index: 1;
}

/* Act base styles — transparent background so WebGL shows through */
.act {
  position: relative;
  width: 100%;
  background: transparent;
}

/*
 * Act heights are set via inline :style binding from useActHeights().
 * These fallback CSS rules handle SSR / no-JS scenarios using desktop values.
 * They are overridden by the inline styles once Vue hydrates.
 */
.act--1 { height: 1200px; }
.act--2 { height: 1300px; }
.act--3 { height: 11500px; }
.act--4 { height: 7000px; }
.act--5 { height: 12000px; }
.act--6 { height: 3000px; }
</style>
