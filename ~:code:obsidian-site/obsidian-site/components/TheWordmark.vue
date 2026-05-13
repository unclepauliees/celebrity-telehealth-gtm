<script setup lang="ts">
/**
 * TheWordmark
 *
 * Renders the Obsidian Capital Partners wordmark in pure HTML/CSS.
 * No SVG image — type is set in Cormorant Garamond (obsidian line)
 * and Montserrat (sub line) per brand section 2.1.
 *
 * Structure:
 *   OBSIDIAN          ← Cormorant Garamond 300, tracking +150/1000em
 *   CAPITAL PARTNERS  ← Montserrat 400, tracking +400/1000em
 *
 * Props:
 *   color: 'light' | 'dark' | 'gold'
 *     'light' → Parchment text (for dark backgrounds, default)
 *     'dark'  → Obsidian Black text (for light/parchment backgrounds)
 *     'gold'  → Gold text (for steel backgrounds, used sparingly)
 *
 * Rules:
 *   - Min-width: var(--nav-logo-min-width) = 120px. Never below this.
 *   - No effects, no shadows, no box containing the mark.
 *   - Cormorant Garamond never below 13px computed size.
 */

type WordmarkColor = 'light' | 'dark' | 'gold'

const props = withDefaults(
  defineProps<{ color?: WordmarkColor }>(),
  { color: 'light' },
)
</script>

<template>
  <div
    class="wordmark"
    :class="`wordmark--${props.color}`"
    aria-label="Obsidian Capital Partners"
  >
    <span class="wordmark__obsidian">OBSIDIAN</span>
    <span class="wordmark__sub">CAPITAL PARTNERS</span>
  </div>
</template>

<style scoped>
.wordmark {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: var(--nav-logo-min-width);
  user-select: none;
  /* No effects. No shadows. No border-radius. */
}

/* OBSIDIAN line — Cormorant Garamond 300 */
.wordmark__obsidian {
  font-family: var(--font-serif);
  font-weight: 300;
  font-style: normal;
  font-size: var(--text-wordmark-primary); /* 18px — never below 13px */
  line-height: 1;
  letter-spacing: var(--tracking-wordmark);
  text-transform: uppercase;
  display: block;
}

/* CAPITAL PARTNERS line — Montserrat 400, never italic */
.wordmark__sub {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal; /* Montserrat is NEVER italic */
  font-size: var(--text-wordmark-sub); /* 8px — Montserrat sub-line */
  line-height: 1;
  letter-spacing: var(--tracking-wordmark-sub);
  text-transform: uppercase;
  display: block;
}

/* Color variants — three approved wordmark forms */
.wordmark--light .wordmark__obsidian,
.wordmark--light .wordmark__sub {
  color: var(--color-parchment);
}

.wordmark--dark .wordmark__obsidian,
.wordmark--dark .wordmark__sub {
  color: var(--color-obsidian);
}

.wordmark--gold .wordmark__obsidian,
.wordmark--gold .wordmark__sub {
  color: var(--color-gold);
}
</style>
