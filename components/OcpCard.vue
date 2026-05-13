<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    body: string
    eyebrow?: string
    variant?: 'dark' | 'steel' | 'parchment'
    dataPoint?: string
    footnoteRef?: string
  }>(),
  { variant: 'dark' },
)
</script>

<template>
  <article
    class="ocp-card"
    :class="`ocp-card--${variant}`"
  >
    <header class="ocp-card__header">
      <span v-if="eyebrow" class="ocp-card__eyebrow">{{ eyebrow }}</span>
      <div class="ocp-card__title-row">
        <h3 class="ocp-card__title">
          {{ title }}<sup v-if="footnoteRef" class="ocp-card__footnote-sup">{{ footnoteRef }}</sup>
        </h3>
        <span v-if="dataPoint" class="ocp-card__data-point">{{ dataPoint }}</span>
      </div>
    </header>

    <p class="ocp-card__body">{{ body }}</p>

    <!-- Slot for extra content, e.g. PlatformGrid lockup line -->
    <slot />
  </article>
</template>

<style scoped>
.ocp-card {
  /* 28px internal padding — brand section 3.1 explicit spec */
  padding: 28px;
  border-top: var(--border-gold);
  border-right: none;
  border-bottom: none;
  border-left: none;
  /* No border-radius. No box-shadow. */
  transition: border-top-color var(--duration-micro) var(--ease-ocp);
}

.ocp-card:hover {
  border-top-color: var(--color-gold-light);
}

/* ---- Variant backgrounds ---- */
.ocp-card--dark    { background: var(--color-obsidian); }
.ocp-card--steel   { background: var(--color-forge-steel); }
.ocp-card--parchment { background: var(--color-parchment); }

/* ---- Eyebrow ---- */
.ocp-card__eyebrow {
  display: block;
  font-family: var(--font-sans);
  font-weight: 600;
  font-style: normal;
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-gold);
  margin-bottom: var(--space-1);
}

.ocp-card--parchment .ocp-card__eyebrow {
  color: var(--color-gold-active);
}

/* ---- Title row ---- */
.ocp-card__title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-2);
  margin-bottom: var(--space-2);
}

/* ---- Title ---- */
.ocp-card__title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-style: normal;
  font-size: var(--text-h3);
  letter-spacing: var(--tracking-h3);
  line-height: var(--lh-h3);
  margin: 0;
}

.ocp-card--dark .ocp-card__title,
.ocp-card--steel .ocp-card__title  { color: var(--color-parchment); }
.ocp-card--parchment .ocp-card__title { color: var(--color-obsidian); }

/* Superscript footnote ref */
.ocp-card__footnote-sup {
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  vertical-align: super;
  margin-left: 2px;
}

/* ---- Data point ---- */
.ocp-card__data-point {
  font-family: var(--font-mono);
  font-size: var(--text-data);
  line-height: var(--lh-data);
  color: var(--color-gold);
  text-align: right;
  flex-shrink: 0;
  white-space: nowrap;
}

/* ---- Body ---- */
.ocp-card__body {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-body);
  line-height: var(--lh-body);
  margin: 0;
}

.ocp-card--dark .ocp-card__body,
.ocp-card--steel .ocp-card__body   { color: var(--color-mid-gray); }
.ocp-card--parchment .ocp-card__body { color: var(--color-obsidian); }

/* ---- Responsive additions (Phase 3) ---- */

/* Mobile: reduce padding to 24px (--space-3, on the 8px grid).
   28px desktop spec is brand section 3.1; 24px is brand-compliant on mobile. */
@media (max-width: 767px) {
  .ocp-card {
    padding: var(--space-3);
  }

  /* Title can drop to h4 scale (16px) if layout requires it */
  .ocp-card__title {
    font-size: var(--text-h4);
    letter-spacing: var(--tracking-h4);
    line-height: var(--lh-h4);
  }
}
</style>
