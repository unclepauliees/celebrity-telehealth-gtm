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
    <!-- Page outline with folded top-right corner -->
    <polygon points="5,3 15,3 19,7 19,21 5,21" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" />
    <!-- Fold crease lines -->
    <polyline points="15,3 15,7 19,7" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" />
    <!-- Content lines -->
    <line x1="8" y1="11" x2="16" y2="11" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
    <line x1="8" y1="15" x2="14" y2="15" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
  </svg>
</template>
