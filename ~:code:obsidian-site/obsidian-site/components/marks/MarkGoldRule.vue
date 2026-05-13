<script setup lang="ts">
withDefaults(defineProps<{ width?: string }>(), { width: '100%' })
</script>

<template>
  <div class="mark-gold-rule" :style="{ width }" />
</template>

<style scoped>
.mark-gold-rule {
  height: 1px;
  /* rgba() is not a raw hex — same pattern used in tokens.css for --border-gold-faint */
  background: rgba(184, 150, 90, 0.4);
  flex-shrink: 0;
}
</style>
