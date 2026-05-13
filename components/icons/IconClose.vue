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
    <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
    <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" />
  </svg>
</template>
