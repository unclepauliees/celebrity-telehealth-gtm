<script setup lang="ts">
definePageMeta({ name: 'dev-components' })

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Not Found' })
}

const TEXT_SCALE = [
  { token: '--text-display',    value: '80px',  label: 'Display' },
  { token: '--text-h1',         value: '56px',  label: 'H1' },
  { token: '--text-h2',         value: '40px',  label: 'H2' },
  { token: '--text-h3',         value: '20px',  label: 'H3' },
  { token: '--text-h4',         value: '16px',  label: 'H4' },
  { token: '--text-body-lg',    value: '18px',  label: 'Body Large' },
  { token: '--text-body',       value: '15px',  label: 'Body' },
  { token: '--text-body-sm',    value: '13px',  label: 'Body Small' },
  { token: '--text-caption',    value: '11px',  label: 'Caption' },
  { token: '--text-label',      value: '10px',  label: 'Label' },
  { token: '--text-eyebrow',    value: '10px',  label: 'Eyebrow' },
  { token: '--text-data',       value: '14px',  label: 'Data' },
  { token: '--text-pull-quote', value: '28px',  label: 'Pull Quote' },
]

const COLOR_SWATCHES = [
  { token: '--color-obsidian',       hex: '#0A0A0A',   label: 'Obsidian' },
  { token: '--color-parchment',      hex: '#F5F2EE',   label: 'Parchment' },
  { token: '--color-gold',           hex: '#B8965A',   label: 'Gold' },
  { token: '--color-gold-light',     hex: '#D4AF78',   label: 'Gold Light' },
  { token: '--color-gold-active',    hex: '#9A7A45',   label: 'Gold Active' },
  { token: '--color-forge-steel',    hex: '#1C2535',   label: 'Forge Steel' },
  { token: '--color-ember',          hex: '#C4883A',   label: 'Ember' },
  { token: '--color-rule-dark',      hex: '#2A2A2A',   label: 'Rule Dark' },
  { token: '--color-mid-gray',       hex: '#6B6B6B',   label: 'Mid Gray' },
  { token: '--color-status-green',   hex: '#2D5C3D',   label: 'Status Green' },
  { token: '--color-status-amber',   hex: '#7A5A1E',   label: 'Status Amber' },
  { token: '--color-status-burgundy', hex: '#5C2D2D',  label: 'Status Burgundy' },
]

const SAMPLE_MANDATES = [
  {
    title: 'Essential Infrastructure',
    sector: 'infrastructure' as const,
    description: 'We acquire and develop essential infrastructure assets that underpin economic activity — water, energy, logistics, and digital backbone.',
    deploymentRange: '$50M–$200M',
    targetReturn: '12%–16% net IRR',
  },
  {
    title: 'Industrial Technology',
    sector: 'technology' as const,
    description: 'Platform-stage industrial software and automation businesses that solve fundamental operating inefficiencies in hard asset sectors.',
    deploymentRange: '$25M–$100M',
    targetReturn: '18%–24% net IRR',
  },
  {
    title: 'Real Asset Platforms',
    sector: 'realAssets' as const,
    description: 'Concentrated positions in real asset operating companies with durable cash flow profiles and identifiable expansion vectors.',
    deploymentRange: '$75M–$300M',
    targetReturn: '10%–14% net IRR',
  },
]

const SAMPLE_PLATFORMS = [
  { name: 'Hydronex', mandate: 'Municipal and industrial water treatment infrastructure platform serving GCC markets.', status: 'live' as const },
  { name: 'Tempist Systems', mandate: 'Industrial automation software for thermal process management in manufacturing.', status: 'live' as const },
  { name: 'OpenLoop KSA', mandate: 'Digital health platform connecting patients to licensed telehealth providers in Saudi Arabia.', status: 'draft' as const },
]

const SAMPLE_LOCATIONS = [
  { location: 'Riyadh, Saudi Arabia', descriptor: 'Principal Office' },
  { location: 'Dubai, UAE', descriptor: 'Infrastructure Hub' },
  { location: 'Houston, TX', descriptor: 'Energy Corridor' },
  { location: 'Singapore', descriptor: 'Asia-Pacific Gateway' },
  { location: 'Nairobi, Kenya', descriptor: 'Emerging Markets Node' },
  { location: 'London, UK', descriptor: 'Capital Markets' },
  { location: 'New York, NY', descriptor: 'Technology Corridor' },
]
</script>

<template>
  <div class="dev-showcase">

    <header class="dev-showcase__header">
      <h1 class="dev-showcase__page-title">OCP Component Showcase</h1>
      <p class="dev-showcase__page-subtitle">Development only — not linked from production.</p>
    </header>

    <!-- ----------------------------------------------------------------
         1. TYPOGRAPHY SCALE
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">01 / Typography Scale — Serif (Cormorant Garamond)</h2>
      <div class="dev-type-grid">
        <div v-for="t in TEXT_SCALE" :key="t.token + '-serif'" class="dev-type-row">
          <span class="dev-type-meta">{{ t.token }} / {{ t.value }}</span>
          <span class="dev-type-sample dev-type-sample--serif" :style="{ fontSize: `var(${t.token})` }">
            {{ t.label }} — The Quick Brown Fox
          </span>
        </div>
      </div>
      <h2 class="dev-section__label" style="margin-top: 32px;">01 / Typography Scale — Sans (Montserrat)</h2>
      <div class="dev-type-grid">
        <div v-for="t in TEXT_SCALE" :key="t.token + '-sans'" class="dev-type-row">
          <span class="dev-type-meta">{{ t.token }} / {{ t.value }}</span>
          <span class="dev-type-sample dev-type-sample--sans" :style="{ fontSize: `var(${t.token})` }">
            {{ t.label }} — The Quick Brown Fox
          </span>
        </div>
      </div>
    </section>

    <!-- ----------------------------------------------------------------
         2. COLOR PALETTE
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">02 / Color Palette</h2>
      <div class="dev-color-grid">
        <div
          v-for="swatch in COLOR_SWATCHES"
          :key="swatch.token"
          class="dev-swatch"
        >
          <div
            class="dev-swatch__chip"
            :style="{ background: `var(${swatch.token})` }"
          />
          <span class="dev-swatch__label">{{ swatch.label }}</span>
          <span class="dev-swatch__token">{{ swatch.token }}</span>
          <span class="dev-swatch__hex">{{ swatch.hex }}</span>
        </div>
      </div>
    </section>

    <!-- ----------------------------------------------------------------
         3. OCPBUTTON
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">03 / OcpButton</h2>
      <div class="dev-row">
        <OcpButton variant="primary">Primary Button</OcpButton>
        <OcpButton variant="secondary">Secondary Button</OcpButton>
        <OcpButton variant="primary" disabled>Primary Disabled</OcpButton>
        <OcpButton variant="secondary" disabled>Secondary Disabled</OcpButton>
        <OcpButton variant="primary" tag="a" href="#">Primary Link</OcpButton>
      </div>
    </section>

    <!-- ----------------------------------------------------------------
         4. OCPCARD
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">04 / OcpCard — Variants</h2>
      <div class="dev-card-grid">
        <OcpCard
          title="Dark Variant"
          body="Essential infrastructure platform deploying capital into water, energy, and digital backbone assets."
          eyebrow="Infrastructure"
          variant="dark"
          data-point="$50M–$200M"
        />
        <OcpCard
          title="Steel Variant"
          body="Industrial automation and platform software businesses solving operational inefficiencies at scale."
          eyebrow="Technology"
          variant="steel"
          data-point="$25M–$100M"
        />
        <OcpCard
          title="Parchment Variant"
          body="Real asset operating companies with durable cash flow profiles and identifiable expansion vectors."
          eyebrow="Real Assets"
          variant="parchment"
          data-point="$75M–$300M"
        />
        <OcpCard
          title="No Data Point"
          body="Card variant without data-point prop — layout adjusts, title spans full width."
          eyebrow="Sector"
          variant="dark"
        />
        <OcpCard
          title="With Footnote Ref"
          body="Target returns are illustrative only and not a guarantee of future performance."
          eyebrow="Returns"
          variant="dark"
          data-point="12%–18% IRR"
          footnote-ref="1"
        />
      </div>
    </section>

    <!-- ----------------------------------------------------------------
         5. MANDATESGRID
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">05 / MandatesGrid</h2>
      <MandatesGrid :mandates="SAMPLE_MANDATES" />
    </section>

    <!-- ----------------------------------------------------------------
         6. PLATFORMGRID
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">06 / PlatformGrid</h2>
      <PlatformGrid :platforms="SAMPLE_PLATFORMS" />
    </section>

    <!-- ----------------------------------------------------------------
         7. WHEREBUILDLIST
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">07 / WhereBuildList</h2>
      <WhereBuildList :items="SAMPLE_LOCATIONS" />
    </section>

    <!-- ----------------------------------------------------------------
         8. OCPFOOTER
         ---------------------------------------------------------------- -->
    <section class="dev-section dev-section--no-pad">
      <h2 class="dev-section__label dev-section__label--padded">08 / OcpFooter</h2>
      <OcpFooter />
    </section>

    <!-- ----------------------------------------------------------------
         9. ICONS
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">09 / Icons</h2>
      <div class="dev-icon-grid">
        <div class="dev-icon-cell">
          <IconArrowRight :size="32" />
          <span>IconArrowRight</span>
        </div>
        <div class="dev-icon-cell">
          <IconChevronDown :size="32" />
          <span>IconChevronDown</span>
        </div>
        <div class="dev-icon-cell">
          <IconClose :size="32" />
          <span>IconClose</span>
        </div>
        <div class="dev-icon-cell">
          <IconExternalLink :size="32" />
          <span>IconExternalLink</span>
        </div>
        <div class="dev-icon-cell">
          <IconDocument :size="32" />
          <span>IconDocument</span>
        </div>
        <div class="dev-icon-cell">
          <IconLocation :size="32" />
          <span>IconLocation</span>
        </div>
      </div>
    </section>

    <!-- ----------------------------------------------------------------
         10. MARKS
         ---------------------------------------------------------------- -->
    <section class="dev-section">
      <h2 class="dev-section__label">10 / Marks</h2>

      <div class="dev-mark-row">
        <span class="dev-mark-label">MarkGoldRule (full width)</span>
        <div class="dev-mark-container dev-mark-container--dark">
          <MarkGoldRule />
        </div>
      </div>

      <div class="dev-mark-row">
        <span class="dev-mark-label">MarkGoldRule (50% width)</span>
        <div class="dev-mark-container dev-mark-container--dark">
          <MarkGoldRule width="50%" />
        </div>
      </div>

      <div class="dev-mark-row">
        <span class="dev-mark-label">MarkObsidianFracture</span>
        <div class="dev-mark-container dev-mark-container--dark dev-mark-container--tall">
          <MarkObsidianFracture />
        </div>
      </div>

      <div class="dev-mark-row">
        <span class="dev-mark-label">MarkSectionLabel</span>
        <div class="dev-mark-container dev-mark-container--dark">
          <MarkSectionLabel number="03" label="THE CAPITAL CHAIN" />
        </div>
      </div>
      <div class="dev-mark-row">
        <span class="dev-mark-label">MarkSectionLabel</span>
        <div class="dev-mark-container dev-mark-container--dark">
          <MarkSectionLabel number="01" label="WE BUILD. WE DON'T BROKER." />
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.dev-showcase {
  background: var(--color-obsidian);
  color: var(--color-parchment);
  min-height: 100vh;
}

.dev-showcase__header {
  padding: var(--space-8) var(--space-8) var(--space-4);
  border-bottom: var(--border-rule);
}

.dev-showcase__page-title {
  font-family: var(--font-serif);
  font-weight: 300;
  font-size: var(--text-h1);
  margin: 0 0 var(--space-1);
  color: var(--color-parchment);
}

.dev-showcase__page-subtitle {
  font-family: var(--font-sans);
  font-size: var(--text-body-sm);
  color: var(--color-mid-gray);
  margin: 0;
}

/* ---- Section wrapper ---- */
.dev-section {
  padding: var(--space-8);
  border-bottom: var(--border-rule);
}

.dev-section--no-pad {
  padding: 0;
}

.dev-section__label {
  font-family: var(--font-sans);
  font-weight: 600;
  font-style: normal;
  font-size: var(--text-eyebrow);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  color: var(--color-gold);
  margin: 0 0 var(--space-4);
}

.dev-section__label--padded {
  padding: var(--space-4) var(--space-8) 0;
  margin-bottom: var(--space-4);
}

/* ---- Typography ---- */
.dev-type-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dev-type-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
}

.dev-type-meta {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-mid-gray);
  min-width: 240px;
  flex-shrink: 0;
}

.dev-type-sample--serif {
  font-family: var(--font-serif);
  font-weight: 300;
  font-style: normal;
  color: var(--color-parchment);
}

.dev-type-sample--sans {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  color: var(--color-parchment);
}

/* ---- Color swatches ---- */
.dev-color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
  gap: var(--space-3);
}

.dev-swatch {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dev-swatch__chip {
  height: 64px;
  width: 100%;
  border: var(--border-rule);
}

.dev-swatch__label {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: var(--text-caption);
  color: var(--color-parchment);
}

.dev-swatch__token,
.dev-swatch__hex {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-mid-gray);
}

/* ---- Buttons row ---- */
.dev-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  align-items: center;
}

/* ---- Card grid ---- */
.dev-card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

/* ---- Icon grid ---- */
.dev-icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.dev-icon-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-gold);
  min-width: 96px;
}

.dev-icon-cell span {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-mid-gray);
  text-align: center;
}

/* ---- Marks ---- */
.dev-mark-row {
  margin-bottom: var(--space-4);
}

.dev-mark-label {
  display: block;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-mid-gray);
  margin-bottom: var(--space-1);
}

.dev-mark-container {
  padding: var(--space-3);
}

.dev-mark-container--dark {
  background: var(--color-obsidian);
  border: var(--border-rule);
}

.dev-mark-container--tall {
  padding: 0;
}
</style>
