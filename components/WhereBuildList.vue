<script setup lang="ts">
defineProps<{
  items: Array<{
    location: string
    descriptor: string
  }>
}>()
</script>

<template>
  <div class="where-build">
    <div class="where-build__heading-col">
      <h2 class="where-build__heading">WHERE WE BUILD</h2>
    </div>

    <ul class="where-build__list">
      <li
        v-for="item in items"
        :key="item.location"
        class="where-build__item"
      >
        <span class="where-build__location">{{ item.location }}</span>
        <span class="where-build__descriptor">{{ item.descriptor }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Mobile-first: single column, no sticky heading */
.where-build {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
  align-items: start;
}

/* Heading is a block above the list on mobile — no sticky */
.where-build__heading-col {
  position: static;
}

.where-build__heading {
  font-family: var(--font-serif);
  font-weight: 300;
  font-style: normal;
  font-size: var(--text-h2);
  letter-spacing: var(--tracking-h2);
  line-height: var(--lh-h2);
  margin: 0;
}

/* Right column — scrolling list */
.where-build__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.where-build__item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: var(--border-rule);
}

.where-build__item:first-child {
  border-top: var(--border-rule);
}

.where-build__location {
  font-family: var(--font-sans);
  font-weight: 600;
  font-style: normal;
  font-size: var(--text-body);
  letter-spacing: var(--tracking-body);
}

.where-build__descriptor {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-body-sm);
  color: var(--color-mid-gray);
  text-align: right;
}

/* Tablet (768px–1023px): restore 2-col layout.
   Sticky threshold reduced (heading sticks at nav-height + space-1) */
@media (min-width: 768px) {
  .where-build {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
  }

  .where-build__heading-col {
    position: sticky;
    top: calc(var(--nav-height) + var(--space-1));
  }
}

/* Desktop (≥ 1024px): same 2-col layout, sticky at exact nav-height */
@media (min-width: 1024px) {
  .where-build__heading-col {
    top: var(--nav-height);
  }
}
</style>
