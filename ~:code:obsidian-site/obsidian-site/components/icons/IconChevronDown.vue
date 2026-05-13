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
    <polyline points="5,9 12,17 19,9" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" />
  </svg>
</template>
