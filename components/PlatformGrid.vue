<script setup lang="ts">
defineProps<{
  platforms: Array<{
    name: string
    mandate: string
    status?: 'draft' | 'live'
  }>
}>()
</script>

<template>
  <div class="platform-grid">
    <OcpCard
      v-for="platform in platforms"
      :key="platform.name"
      variant="steel"
      :title="platform.name"
      :body="platform.mandate"
    >
      <div class="platform-grid__lockup">
        AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY
      </div>
    </OcpCard>
  </div>
</template>

<style scoped>
/* Mobile-first: single column at base (< 768px) */
.platform-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

/* Tablet (768px–1023px): 2 columns; third card spans full width */
@media (min-width: 768px) {
  .platform-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Third card spans both columns when there are 3 cards */
  .platform-grid > :nth-child(3) {
    grid-column: 1 / -1;
  }
}

/* Desktop (≥ 1024px): 3 equal columns */
@media (min-width: 1024px) {
  .platform-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Reset the third-card override */
  .platform-grid > :nth-child(3) {
    grid-column: auto;
  }
}

/* Lockup line beneath card body */
.platform-grid__lockup {
  padding-top: var(--space-2);
  border-top: var(--border-gold-faint);
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-label);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  /* Spec: gold at 60% opacity — opacity applied to containing element */
  color: var(--color-gold);
  opacity: 0.6;
  margin-top: var(--space-2);
}
</style>
