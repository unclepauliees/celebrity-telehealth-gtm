<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 24 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Box open at top-right to imply outward direction -->
    <polyline points="10,5 5,5 5,19 19,19 19,14" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" />
    <!-- Arrow pointing to top-right corner -->
    <line x1="13" y1="5" x2="19" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
    <line x1="19" y1="5" x2="19" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
    <line x1="11" y1="13" x2="19" y2="5" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
  </svg>
</template>
