<script setup lang="ts">
// No props — this is a fixed decorative composition
</script>

<template>
  <svg
    class="mark-fracture"
    viewBox="0 0 1440 80"
    preserveAspectRatio="none"
    fill="none"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 5 diagonal fracture segments arranged as an asymmetric shard composition -->
    <line x1="0"    y1="45"  x2="320"  y2="12"  stroke="rgba(184,150,90,0.2)" stroke-width="1" />
    <line x1="280"  y1="14"  x2="680"  y2="68"  stroke="rgba(184,150,90,0.2)" stroke-width="1" />
    <line x1="640"  y1="62"  x2="960"  y2="8"   stroke="rgba(184,150,90,0.2)" stroke-width="1" />
    <line x1="920"  y1="10"  x2="1200" y2="55"  stroke="rgba(184,150,90,0.2)" stroke-width="1" />
    <line x1="1160" y1="52"  x2="1440" y2="20"  stroke="rgba(184,150,90,0.2)" stroke-width="1" />
  </svg>
</template>

<style scoped>
.mark-fracture {
  display: block;
  width: 100%;
  height: 80px;
}
</style>
