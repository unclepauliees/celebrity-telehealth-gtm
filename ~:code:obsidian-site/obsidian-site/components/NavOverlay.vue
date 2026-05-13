<script setup lang="ts">
/**
 * NavOverlay
 *
 * Full-viewport overlay menu.
 * Background: var(--color-parchment) (#F5F2EE)
 * Text: Obsidian Black on Parchment (approved pairing)
 *
 * Two-column layout:
 *   Left:  wordmark + primary nav links + utility links
 *   Right: three platform companies with sector labels
 *
 * Accessibility:
 *   - Focus trap: when open, focus cycles through all interactive elements
 *   - ESC closes the overlay
 *   - On close, focus returns to the NavMenuPill trigger
 *
 * Transition: opacity only (fade) at --duration-section (500ms) with
 * --ease-ocp. No slide. No scale. Per brand motion rules.
 */

const props = defineProps<{
  isOpen: boolean
  /** Callback to restore focus to the trigger element on close */
  triggerFocus?: (() => void) | null
}>()

const emit = defineEmits<{ close: [] }>()

const overlayRef = ref<HTMLElement | null>(null)

// Query for all focusable elements within the overlay
const getFocusableElements = (): HTMLElement[] => {
  if (!overlayRef.value) return []
  return Array.from(
    overlayRef.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

// Focus trap: keep Tab cycling within the overlay
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
    return
  }

  if (event.key !== 'Tab') return

  const focusable = getFocusableElements()
  if (focusable.length === 0) return

  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey) {
    // Shift+Tab: if focus is on first element, wrap to last
    if (document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
  } else {
    // Tab: if focus is on last element, wrap to first
    if (document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}

// When overlay opens: move focus to first nav link, register keydown listener
// When overlay closes: restore focus to the menu pill trigger
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      // Wait for the DOM to render before querying focusable elements
      nextTick(() => {
        const focusable = getFocusableElements()
        if (focusable.length > 0) {
          focusable[0].focus()
        }
        document.addEventListener('keydown', handleKeydown)
        // Prevent body scroll while overlay is open
        document.body.style.overflow = 'hidden'
      })
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
      // Restore focus to the trigger element via the exposed focus() callback
      props.triggerFocus?.()
    }
  },
)

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Transition name="overlay">
    <div
      v-if="props.isOpen"
      id="nav-overlay"
      ref="overlayRef"
      class="nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div class="nav-overlay__grid">

        <!-- LEFT COLUMN: wordmark + primary nav + utility links -->
        <div class="nav-overlay__left">

          <div class="nav-overlay__wordmark-wrap">
            <TheWordmark color="dark" />
          </div>

          <nav aria-label="Primary navigation">
            <ul class="nav-overlay__links">
              <li>
                <a
                  class="nav-overlay__link"
                  href="/"
                  @click="emit('close')"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  class="nav-overlay__link"
                  href="/mandate"
                  @click="emit('close')"
                >
                  Mandate
                </a>
              </li>
              <li>
                <a
                  class="nav-overlay__link"
                  href="/platforms"
                  @click="emit('close')"
                >
                  Platforms
                </a>
              </li>
              <li>
                <a
                  class="nav-overlay__link"
                  href="/insights"
                  @click="emit('close')"
                >
                  Insights
                </a>
              </li>
              <li>
                <a
                  class="nav-overlay__link"
                  href="/principals"
                  @click="emit('close')"
                >
                  Principals
                </a>
              </li>
            </ul>
          </nav>

          <!-- Utility links at bottom-left -->
          <div class="nav-overlay__utility">
            <a class="nav-overlay__utility-link" href="/careers" @click="emit('close')">
              Careers
            </a>
            <a class="nav-overlay__utility-link" href="/terms" @click="emit('close')">
              Terms
            </a>
            <a class="nav-overlay__utility-link" href="/privacy" @click="emit('close')">
              Privacy
            </a>
          </div>

        </div>

        <!-- RIGHT COLUMN: platform companies -->
        <div class="nav-overlay__right">

          <div class="nav-overlay__platform">
            <span class="nav-overlay__platform-label">
              AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY
            </span>
            <a class="nav-overlay__platform-name" href="/platforms/hydronex" @click="emit('close')">
              <span class="nav-overlay__platform-icon" aria-hidden="true">
                <!-- Water drop icon — SVG inline -->
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M8 2C8 2 3 7.5 3 10.5a5 5 0 0 0 10 0C13 7.5 8 2 8 2Z"
                    stroke="currentColor"
                    stroke-width="1"
                    fill="none"
                  />
                </svg>
              </span>
              Hydronex
            </a>
            <span class="nav-overlay__platform-sector">Water Infrastructure</span>
          </div>

          <div class="nav-overlay__platform">
            <span class="nav-overlay__platform-label">
              AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY
            </span>
            <a class="nav-overlay__platform-name" href="/platforms/tempist-systems" @click="emit('close')">
              <span class="nav-overlay__platform-icon" aria-hidden="true">
                <!-- Circuit mark icon — SVG inline -->
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="5" y="5" width="6" height="6" stroke="currentColor" stroke-width="1" />
                  <line x1="8" y1="2" x2="8" y2="5" stroke="currentColor" stroke-width="1" />
                  <line x1="8" y1="11" x2="8" y2="14" stroke="currentColor" stroke-width="1" />
                  <line x1="2" y1="8" x2="5" y2="8" stroke="currentColor" stroke-width="1" />
                  <line x1="11" y1="8" x2="14" y2="8" stroke="currentColor" stroke-width="1" />
                </svg>
              </span>
              Tempist Systems
            </a>
            <span class="nav-overlay__platform-sector">Industrial Automation</span>
          </div>

          <div class="nav-overlay__platform">
            <span class="nav-overlay__platform-label">
              AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY
            </span>
            <a class="nav-overlay__platform-name" href="/platforms/openloop-ksa" @click="emit('close')">
              <span class="nav-overlay__platform-icon" aria-hidden="true">
                <!-- Health cross icon — SVG inline -->
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <rect x="6" y="2" width="4" height="12" fill="currentColor" />
                  <rect x="2" y="6" width="12" height="4" fill="currentColor" />
                </svg>
              </span>
              OpenLoop KSA
            </a>
            <span class="nav-overlay__platform-sector">Digital Health · Saudi Arabia</span>
          </div>

        </div>

      </div>

      <!-- Close button (accessible) -->
      <button
        class="nav-overlay__close"
        aria-label="Close navigation menu"
        @click="emit('close')"
      >
        <span aria-hidden="true">✕</span>
      </button>

    </div>
  </Transition>
</template>

<style scoped>
/* --------------------------------------------------------------------------
   OVERLAY — base
   -------------------------------------------------------------------------- */
.nav-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  background: var(--color-parchment);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* --------------------------------------------------------------------------
   TRANSITION — opacity only (fade), no slide, no scale
   Duration: --duration-section (500ms), easing: --ease-ocp
   -------------------------------------------------------------------------- */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity var(--duration-section) var(--ease-ocp);
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.overlay-enter-to,
.overlay-leave-from {
  opacity: 1;
}

/* --------------------------------------------------------------------------
   GRID — two columns
   -------------------------------------------------------------------------- */
.nav-overlay__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--grid-gutter);
  padding: var(--nav-height) var(--grid-margin-desktop);
  flex: 1;
  align-items: start;
}

/* --------------------------------------------------------------------------
   LEFT COLUMN
   -------------------------------------------------------------------------- */
.nav-overlay__left {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  padding-top: var(--space-6);
}

.nav-overlay__wordmark-wrap {
  /* Wordmark sits top of left column */
}

.nav-overlay__links {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.nav-overlay__link {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-body-sm);
  letter-spacing: var(--tracking-nav);
  color: var(--color-obsidian);
  text-transform: uppercase;
  transition: color var(--duration-micro) var(--ease-ocp);
}

.nav-overlay__link:hover,
.nav-overlay__link:focus-visible {
  color: var(--color-gold-active);
}

/* Utility links */
.nav-overlay__utility {
  display: flex;
  flex-direction: row;
  gap: var(--space-4);
  margin-top: auto;
}

.nav-overlay__utility-link {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-caption);
  color: var(--color-mid-gray);
  text-transform: uppercase;
  transition: color var(--duration-micro) var(--ease-ocp);
}

.nav-overlay__utility-link:hover,
.nav-overlay__utility-link:focus-visible {
  color: var(--color-obsidian);
}

/* --------------------------------------------------------------------------
   RIGHT COLUMN — platform companies
   -------------------------------------------------------------------------- */
.nav-overlay__right {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding-top: var(--space-6);
}

.nav-overlay__platform {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  border-top: var(--border-rule);
  padding-top: var(--space-3);
}

/* "AN OBSIDIAN CAPITAL PARTNERS PLATFORM COMPANY" label */
.nav-overlay__platform-label {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-eyebrow);
  color: var(--color-mid-gray);
  text-transform: uppercase;
  display: block;
}

/* Platform name link */
.nav-overlay__platform-name {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-sans);
  font-weight: 600;
  font-style: normal;
  font-size: var(--text-h4);
  letter-spacing: var(--tracking-h4);
  color: var(--color-obsidian);
  text-transform: uppercase;
  transition: color var(--duration-micro) var(--ease-ocp);
}

.nav-overlay__platform-name:hover,
.nav-overlay__platform-name:focus-visible {
  color: var(--color-gold-active);
}

.nav-overlay__platform-icon {
  display: flex;
  align-items: center;
  color: var(--color-gold);
}

/* Sector label */
.nav-overlay__platform-sector {
  font-family: var(--font-sans);
  font-weight: 400;
  font-style: normal;
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-caption);
  color: var(--color-mid-gray);
  display: block;
}

/* --------------------------------------------------------------------------
   CLOSE BUTTON
   -------------------------------------------------------------------------- */
.nav-overlay__close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-5);
  height: var(--space-5);
  background: none;
  border: var(--border-gold-faint);
  color: var(--color-obsidian);
  font-size: var(--text-body);
  cursor: pointer;
  transition:
    border-color var(--duration-micro) var(--ease-ocp),
    color var(--duration-micro) var(--ease-ocp);
}

.nav-overlay__close:hover {
  border-color: var(--color-gold);
  color: var(--color-gold-active);
}
</style>
