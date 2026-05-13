<script setup lang="ts">
defineProps<{
  mandates: Array<{
    title: string
    sector: 'infrastructure' | 'technology' | 'realAssets'
    description: string
    deploymentRange: string
    targetReturn?: string
  }>
}>()

const sectorLabel: Record<string, string> = {
  infrastructure: 'Infrastructure',
  technology: 'Technology',
  realAssets: 'Real Assets',
}
</script>

<template>
  <div class="mandates-wrapper">
    <div class="mandates-grid">
      <OcpCard
        v-for="mandate in mandates"
        :key="mandate.title"
        variant="dark"
        :eyebrow="`${sectorLabel[mandate.sector]} · ${mandate.deploymentRange}`"
        :title="mandate.title"
        :body="mandate.description"
        :data-point="mandate.targetReturn"
        :footnote-ref="mandate.targetReturn ? '1' : undefined"
      />
    </div>

    <p class="mandates-footnote">
      ¹ Illustrative. Subject to change. Not a guarantee of returns.
    </p>
  </div>
</template>

<style scoped>
/* Mobile-first: single column at base (< 768px) */
.mandates-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

/* Tablet (768px–1023px): 2 columns; third card spans full width */
@media (min-width: 768px) {
  .mandates-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Third card spans both columns */
  .mandates-grid > :nth-child(3) {
    grid-column: 1 / -1;
  }
}

/* Desktop (≥ 1024px): 3 equal columns */
@media (min-width: 1024px) {
  .mandates-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  /* Reset the third-card override */
  .mandates-grid > :nth-child(3) {
    grid-column: auto;
  }
}

.mandates-footnote {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-caption);
  line-height: var(--lh-caption);
  color: var(--color-mid-gray);
  margin-top: var(--space-3);
  margin-bottom: 0;
}
</style>
