<script setup lang="ts">
/**
 * ScenePin
 *
 * Projects a Three.js world coordinate to a 2D CSS position on screen.
 * Slot content is absolutely positioned at the projected pixel coordinate.
 *
 * Visibility is gated by a scroll range (activeFrom / activeTo). Outside
 * the range the pin fades out via CSS transition using token values.
 *
 * Usage:
 *   <ScenePin :world-pos="[0, 1, 0]" :active-from="2500" :active-to="14000">
 *     <SomeLabel />
 *   </ScenePin>
 */

interface Props {
  /** Three.js world-space coordinates [x, y, z] */
  worldPos: [number, number, number]
  /** scrollY value at which the pin starts appearing */
  activeFrom: number
  /** scrollY value at which the pin stops appearing */
  activeTo: number
  /**
   * When true, the pin is hidden on mobile (< 768px) to avoid
   * overlapping UI content on narrow viewports.
   * Defaults to false (pin visible on all breakpoints).
   */
  hiddenOnMobile?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hiddenOnMobile: false,
})

// Screen position (CSS percentages) for the projected world point
const pinLeft = ref('50%')
const pinTop = ref('50%')

// Opacity: 0 when outside scroll range, 1 when inside
const pinOpacity = ref(0)

// Camera from the shared scene camera composable
const cameraRef = useSceneCamera()
let rafId = 0

onMounted(async () => {
  // Dynamic import of Three.js — hits the 'three' Vite chunk
  const THREE = await import('three')

  // Reusable Three.js vectors (allocated once, not per-frame)
  const worldVec = new THREE.Vector3(...props.worldPos)
  const ndcVec = new THREE.Vector3()

  const tick = () => {
    const rawScroll = window.scrollY

    // Compute opacity based on active range
    const inRange = rawScroll >= props.activeFrom && rawScroll <= props.activeTo
    pinOpacity.value = inRange ? 1 : 0

    // Project world point if we have a camera
    const camera = cameraRef.value
    if (camera) {
      ndcVec.copy(worldVec)
      ndcVec.project(camera)

      // NDC [-1, 1] → CSS percentage [0%, 100%]
      pinLeft.value = `${((ndcVec.x + 1) / 2) * 100}%`
      // NDC Y is inverted vs CSS (NDC +1 = top, CSS 0% = top)
      pinTop.value = `${((1 - ndcVec.y) / 2) * 100}%`
    }

    rafId = requestAnimationFrame(tick)
  }

  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <!-- Full-viewport container — absolutely positioned overlay -->
  <div
    class="scene-pin-viewport"
    :class="{ 'scene-pin-viewport--hidden-mobile': hiddenOnMobile }"
    aria-hidden="true"
  >
    <div
      class="scene-pin-point"
      :style="{
        left: pinLeft,
        top: pinTop,
        opacity: pinOpacity,
      }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Full-viewport container for pin overlay.
   position:fixed so it sits atop all content without affecting layout. */
.scene-pin-viewport {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 2;
}

/* The projected 2D position of the 3D world point */
.scene-pin-point {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition:
    opacity var(--duration-section) var(--ease-ocp),
    left var(--duration-micro) var(--ease-ocp),
    top var(--duration-micro) var(--ease-ocp);
}

/* Mobile: hide pins that opt into hiddenOnMobile prop */
@media (max-width: 767px) {
  .scene-pin-viewport--hidden-mobile {
    display: none;
  }
}
</style>
