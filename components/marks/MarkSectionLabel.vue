<script setup lang="ts">
defineProps<{ label: string; number: string }>()
</script>

<template>
  <div class="section-label" :aria-label="`Section ${number}: ${label}`">
    <span class="section-label__number">{{ number }}</span>
    <span class="section-label__line" aria-hidden="true" />
    <span class="section-label__text">{{ label }}</span>
  </div>
</template>

<style scoped>
.section-label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  /* Local opacity applied to children — avoids raw hex in property values */
  opacity: 0.6;
  color: var(--color-gold);
}

.section-label__number {
  font-family: var(--font-mono);
  font-size: var(--text-eyebrow);
  color: var(--color-gold);
  white-space: nowrap;
  flex-shrink: 0;
}

/* Flex-grow line connecting number and label — purely decorative */
.section-label__line {
  flex: 1;
  height: 1px;
  background: var(--color-gold);
  min-width: var(--space-4);
}

.section-label__text {
  font-family: var(--font-sans);
  font-weight: 600;
  font-style: normal;
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-gold);
  white-space: nowrap;
  flex-shrink: 0;
}
</style>
