<script setup lang="ts">
/**
 * NavMenuPill
 *
 * Fixed top-right menu trigger.
 * Shows "OBSIDIAN°" text + hamburger icon lines.
 * Gold border, Obsidian Black background.
 * Hover: gold background, black text.
 *
 * Emits:
 *   toggle: when clicked (parent TheNav controls open state)
 *
 * Props:
 *   isOpen: boolean — controls aria-expanded and icon state
 */

defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

// Expose focus() so parent (TheNav) can restore focus here after overlay closes
const buttonEl = ref<HTMLButtonElement | null>(null)
defineExpose({
  focus: () => buttonEl.value?.focus(),
})
</script>

<template>
  <button
    ref="buttonEl"
    class="nav-pill"
    :class="{ 'nav-pill--open': isOpen }"
    :aria-expanded="isOpen"
    aria-controls="nav-overlay"
    aria-label="Open navigation menu"
    @click="emit('toggle')"
  >
    <span class="nav-pill__label">OBSIDIAN°</span>
    <span class="nav-pill__icon" aria-hidden="true">
      <span class="nav-pill__line" />
      <span class="nav-pill__line" />
    </span>
  </button>
</template>

<style scoped>
.nav-pill {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  background: var(--color-obsidian);
  border: var(--border-gold);
  color: var(--color-gold);
  font-family: var(--font-sans);
  font-weight: 600;
  font-style: normal;
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  cursor: pointer;
  transition:
    background var(--duration-micro) var(--ease-ocp),
    color var(--duration-micro) var(--ease-ocp);
}

.nav-pill:hover,
.nav-pill--open {
  background: var(--color-gold);
  color: var(--color-obsidian);
}

.nav-pill:hover .nav-pill__line,
.nav-pill--open .nav-pill__line {
  background: var(--color-obsidian);
}

/* Icon — two horizontal lines */
.nav-pill__icon {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 16px;
  height: 12px;
}

.nav-pill__line {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--color-gold);
  transition:
    background var(--duration-micro) var(--ease-ocp);
}

/* ---- Responsive additions (Phase 3) ---- */

/* Mobile: extend touch target to ≥44px (WCAG 2.5.5) WITHOUT growing the
   visual pill beyond 40px (DEV-003/DEV-004 gold-background limit).
   A transparent ::before pseudo-element extends the tap area by 6px on each
   axis — the gold hover background on the pill element itself stays at its
   natural ~33px height, fully within the ≤40px approved exception. */
@media (max-width: 767px) {
  .nav-pill {
    position: relative;
  }

  .nav-pill::before {
    content: '';
    position: absolute;
    inset: -6px;
    /* Transparent — does not create any visible gold area.
       Only enlarges the hit target. */
  }
}
</style>
