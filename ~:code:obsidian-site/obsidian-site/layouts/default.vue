<script setup lang="ts">
/**
 * Default layout shell.
 *
 * Contains:
 *   - Skip-to-content link (accessibility)
 *   - TheNav (persistent fixed navigation)
 *   - #webgl-canvas-mount (position:fixed placeholder — webgl-scene-engineer populates)
 *   - <main id="main-content"> (page slot)
 *
 * Establishes the section theme context for the entire page.
 * All scroll sections call registerSection() from this context.
 */

// Establish the section theme provider at the layout root
// TheNav and all scroll sections inherit from this
provideSectionTheme()
</script>

<template>
  <div>
    <!-- Skip link: visually hidden until focused (keyboard accessibility) -->
    <a href="#main-content" class="skip-link">
      Skip to main content
    </a>

    <!-- Persistent fixed navigation — present across all six scroll acts -->
    <TheNav />

    <!-- WebGL canvas mount point.
         position:fixed so it stays full-viewport under all scroll sections.
         z-index:0 so scroll sections render on top.
         aria-hidden: the canvas is decorative — all content is in <main>.
         webgl-scene-engineer will inject the Three.js canvas here. -->
    <div
      id="webgl-canvas-mount"
      aria-hidden="true"
      role="presentation"
    />

    <!-- Main content landmark -->
    <main id="main-content" tabindex="-1">
      <slot />
    </main>
  </div>
</template>

<style scoped>
/* Skip link — visually hidden until keyboard focus */
.skip-link {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  padding: var(--space-2) var(--space-3);
  background: var(--color-parchment);
  color: var(--color-obsidian);
  font-family: var(--font-sans);
  font-size: var(--text-body-sm);
  font-weight: 600;
  font-style: normal;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  transform: translateY(-100%);
  transition: transform var(--duration-micro) var(--ease-ocp);
}

.skip-link:focus-visible {
  transform: translateY(0);
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

/* WebGL canvas mount — fixed full-viewport, behind all content */
#webgl-canvas-mount {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none; /* Canvas handles its own events */
}

/* Main content — sits above the WebGL canvas */
main {
  position: relative;
  z-index: 1;
}
</style>
