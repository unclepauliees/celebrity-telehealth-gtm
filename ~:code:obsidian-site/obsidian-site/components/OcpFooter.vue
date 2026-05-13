<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    links?: Array<{ label: string; href: string }>
  }>(),
  {
    links: () => [
      { label: 'About', href: '/about' },
      { label: 'Mandates', href: '/mandate' },
      { label: 'Platforms', href: '/platforms' },
      { label: 'Engage', href: '/engage' },
    ],
  },
)
</script>

<template>
  <footer class="ocp-footer" aria-label="Site footer">

    <!-- 40px structural gold rule — approved brand element per brand spec -->
    <div class="ocp-footer__gold-rule" aria-hidden="true" />

    <div class="ocp-footer__body">
      <div class="ocp-footer__col ocp-footer__col--left">
        <TheWordmark color="dark" />
      </div>

      <nav class="ocp-footer__col ocp-footer__col--center" aria-label="Footer navigation">
        <a
          v-for="link in props.links"
          :key="link.label"
          :href="link.href"
          class="ocp-footer__nav-link"
        >
          {{ link.label }}
        </a>
      </nav>

      <div class="ocp-footer__col ocp-footer__col--right">
        <p class="ocp-footer__copyright">
          &copy; 2026 Obsidian Capital Partners. All rights reserved.
        </p>
        <p class="ocp-footer__legal">
          NOT AN OFFER. FOR INFORMATIONAL PURPOSES ONLY.
        </p>
      </div>
    </div>

  </footer>
</template>

<style scoped>
.ocp-footer {
  background: var(--color-parchment);
  /* No border-radius. No box-shadow. */
}

/* 40px structural gold rule — approved brand element, full width */
.ocp-footer__gold-rule {
  height: 40px;
  width: 100%;
  background: var(--color-gold);
}

/* Footer content area — mobile-first: single column */
.ocp-footer__body {
  display: grid;
  grid-template-columns: 1fr;
  align-items: start;
  gap: var(--space-4);
  padding: var(--space-6) var(--grid-margin-mobile) var(--space-6);
}

/* Left — wordmark */
.ocp-footer__col--left {
  display: flex;
  align-items: flex-start;
}

/* Center — navigation links */
.ocp-footer__col--center {
  display: flex;
  flex-direction: row;
  gap: var(--space-4);
  justify-content: center;
}

/* Right — copyright + legal */
.ocp-footer__col--right {
  display: flex;
  flex-direction: column;
  /* Mobile-first: left-aligned; overridden at tablet/desktop below */
  align-items: flex-start;
  gap: var(--space-1);
}

.ocp-footer__nav-link {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-obsidian);
  text-decoration: none;
  transition: color var(--duration-micro) var(--ease-ocp);
}

.ocp-footer__nav-link:hover,
.ocp-footer__nav-link:focus-visible {
  color: var(--color-gold-active);
}

.ocp-footer__nav-link:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
}

/* Mobile-first: left-aligned text */
.ocp-footer__copyright {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-caption);
  line-height: var(--lh-caption);
  color: var(--color-mid-gray);
  margin: 0;
  text-align: left;
}

.ocp-footer__legal {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-caption);
  line-height: var(--lh-caption);
  letter-spacing: var(--tracking-caption);
  color: var(--color-mid-gray);
  margin: 0;
  text-align: left;
  text-transform: uppercase;
}

/* Tablet (768px–1023px): 2-column layout: logo+nav / legal */
@media (min-width: 768px) {
  .ocp-footer__body {
    grid-template-columns: 1fr 1fr;
    padding: var(--space-8) var(--grid-margin-tablet) var(--space-8);
  }

  /* Left col: wordmark */
  .ocp-footer__col--left {
    grid-column: 1;
    grid-row: 1;
  }

  /* Center col: nav links — place below wordmark on same left side */
  .ocp-footer__col--center {
    grid-column: 1;
    grid-row: 2;
    justify-content: flex-start;
  }

  /* Right col: legal text — spans full right column height */
  .ocp-footer__col--right {
    grid-column: 2;
    grid-row: 1 / 3;
    align-items: flex-end;
    justify-content: flex-end;
  }

  .ocp-footer__copyright,
  .ocp-footer__legal {
    text-align: right;
  }
}

/* Desktop (≥ 1024px): 3-column layout: wordmark / nav / legal */
@media (min-width: 1024px) {
  .ocp-footer__body {
    grid-template-columns: 1fr auto 1fr;
    padding: var(--space-10) var(--space-16) var(--space-10);
  }

  .ocp-footer__col--left {
    grid-column: 1;
    grid-row: 1;
  }

  .ocp-footer__col--center {
    grid-column: 2;
    grid-row: 1;
    justify-content: center;
  }

  .ocp-footer__col--right {
    grid-column: 3;
    grid-row: 1;
    align-items: flex-end;
  }
}
</style>
