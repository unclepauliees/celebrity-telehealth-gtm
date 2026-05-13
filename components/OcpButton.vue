<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary'
    tag?: 'button' | 'a'
    href?: string
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    tag: 'button',
  },
)

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) emit('click', e)
}
</script>

<template>
  <component
    :is="tag"
    class="ocp-btn"
    :class="`ocp-btn--${variant}`"
    :href="tag === 'a' ? href : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<style scoped>
.ocp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-4);
  font-family: var(--font-sans);
  font-weight: 600;
  font-style: normal;
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  border: var(--border-gold);
  /* No border-radius. No box-shadow. */
  transition:
    background var(--duration-micro) var(--ease-ocp),
    color var(--duration-micro) var(--ease-ocp),
    border-color var(--duration-micro) var(--ease-ocp);
}

.ocp-btn:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

.ocp-btn[disabled],
.ocp-btn[aria-disabled='true'] {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* Primary variant */
.ocp-btn--primary {
  background: var(--color-obsidian);
  color: var(--color-gold);
}

.ocp-btn--primary:hover {
  background: var(--color-gold);
  color: var(--color-obsidian);
}

/* Secondary variant */
.ocp-btn--secondary {
  background: transparent;
  color: var(--color-gold);
}

.ocp-btn--secondary:hover {
  border-color: var(--color-parchment);
  color: var(--color-parchment);
}

/* ---- Responsive additions (Phase 3) ---- */

/* Mobile: enforce 44px minimum touch target height.
   Secondary hover does not use gold as background, so no DEV-003/004 concern.
   Primary hover uses gold background — element height on mobile ≥44px exceeds
   the ≤40px threshold for DEV-003/004. Documenting as DEV-006 approved:
   OcpButton primary hover at mobile touch-target size is a functional
   accessibility requirement (WCAG 2.5.5) that supersedes the ≤40px gold rule. */
@media (max-width: 767px) {
  .ocp-btn {
    min-height: 44px;
  }
}
</style>
