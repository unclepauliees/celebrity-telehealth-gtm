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
    <!-- Teardrop approximated with straight segments: top sides angle down to a bottom point -->
    <polygon
      points="12,3 18,8 18,14 12,21 6,14 6,8"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="square"
      stroke-linejoin="miter"
      fill="none"
    />
    <!-- Inner dot -->
    <rect x="11" y="10" width="2" height="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter" fill="none" />
  </svg>
</template>
