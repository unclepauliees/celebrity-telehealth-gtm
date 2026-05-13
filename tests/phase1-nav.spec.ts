import { test, expect } from '@playwright/test'

/**
 * Phase 1 — Navigation acceptance tests
 *
 * Tests:
 * 1. Wordmark is visible with width >= 120px (brand minimum)
 * 2. Overlay menu opens on NavMenuPill click
 * 3. Overlay menu contains primary nav links
 * 4. Keyboard-only navigation cycles through all interactive elements
 * 5. ESC closes the overlay
 * 6. Focus returns to NavMenuPill trigger on close
 */

test.describe('Phase 1 — Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for hydration
    await page.waitForLoadState('networkidle')
  })

  test('wordmark is visible and meets minimum width', async ({ page }) => {
    const wordmark = page.locator('.wordmark')
    await expect(wordmark).toBeVisible()

    const box = await wordmark.boundingBox()
    expect(box).not.toBeNull()
    // Brand minimum width: var(--nav-logo-min-width) = 120px
    expect(box!.width).toBeGreaterThanOrEqual(120)
  })

  test('wordmark contains correct text', async ({ page }) => {
    const obsidianLine = page.locator('.wordmark__obsidian')
    const subLine = page.locator('.wordmark__sub')
    await expect(obsidianLine).toHaveText('OBSIDIAN')
    await expect(subLine).toHaveText('CAPITAL PARTNERS')
  })

  test('nav menu pill is visible', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    await expect(pill).toBeVisible()
  })

  test('overlay opens when nav pill is clicked', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    const overlay = page.locator('#nav-overlay')

    // Overlay should not be visible initially
    await expect(overlay).not.toBeVisible()

    // Click the menu pill
    await pill.click()

    // Overlay should now be visible
    await expect(overlay).toBeVisible()
  })

  test('overlay has parchment background', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    await pill.click()

    const overlay = page.locator('.nav-overlay')
    await expect(overlay).toBeVisible()

    // Check background color matches --color-parchment (#F5F2EE)
    const bgColor = await overlay.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor,
    )
    // rgb(245, 242, 238) = #F5F2EE
    expect(bgColor).toBe('rgb(245, 242, 238)')
  })

  test('overlay contains all primary nav links', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    await pill.click()

    const overlay = page.locator('#nav-overlay')
    await expect(overlay).toBeVisible()

    // All five primary nav links
    await expect(overlay.locator('a[href="/"]')).toBeVisible()
    await expect(overlay.locator('a[href="/mandate"]')).toBeVisible()
    await expect(overlay.locator('a[href="/platforms"]')).toBeVisible()
    await expect(overlay.locator('a[href="/insights"]')).toBeVisible()
    await expect(overlay.locator('a[href="/principals"]')).toBeVisible()
  })

  test('overlay contains platform companies', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    await pill.click()

    const overlay = page.locator('#nav-overlay')
    await expect(overlay).toBeVisible()

    await expect(overlay.locator('text=Hydronex')).toBeVisible()
    await expect(overlay.locator('text=Tempist Systems')).toBeVisible()
    await expect(overlay.locator('text=OpenLoop KSA')).toBeVisible()
  })

  test('keyboard-only navigation: Tab cycles through overlay links', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    await pill.click()

    const overlay = page.locator('#nav-overlay')
    await expect(overlay).toBeVisible()

    // Focus should be on the first nav link after opening
    // Tab through several elements and verify we stay within the overlay
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Active element should still be within the overlay (focus trap)
    const activeInOverlay = await page.evaluate(() => {
      const overlay = document.getElementById('nav-overlay')
      return overlay ? overlay.contains(document.activeElement) : false
    })
    expect(activeInOverlay).toBe(true)
  })

  test('ESC closes the overlay', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    await pill.click()

    const overlay = page.locator('#nav-overlay')
    await expect(overlay).toBeVisible()

    // Press ESC
    await page.keyboard.press('Escape')

    // Overlay should be closed
    await expect(overlay).not.toBeVisible()
  })

  test('focus returns to NavMenuPill after ESC close', async ({ page }) => {
    const pill = page.locator('.nav-pill')

    // Open overlay via keyboard (click pill, focus it first)
    await pill.focus()
    await pill.click()

    const overlay = page.locator('#nav-overlay')
    await expect(overlay).toBeVisible()

    // Close via ESC
    await page.keyboard.press('Escape')
    await expect(overlay).not.toBeVisible()

    // Focus should have returned to the pill
    const focusedElement = await page.evaluate(() =>
      document.activeElement?.className,
    )
    expect(focusedElement).toContain('nav-pill')
  })

  test('skip link is visually hidden but accessible', async ({ page }) => {
    const skipLink = page.locator('.skip-link')
    await expect(skipLink).toBeAttached()

    // Skip link should be off-screen by default (transform: translateY(-100%))
    const transform = await skipLink.evaluate((el) =>
      window.getComputedStyle(el).transform,
    )
    // translateY(-100%) = matrix(1, 0, 0, 1, 0, -height)
    // Just confirm it's not the identity matrix
    expect(transform).not.toBe('none')
  })

  test('overlay aria attributes are correct', async ({ page }) => {
    const pill = page.locator('.nav-pill')
    const overlay = page.locator('#nav-overlay')

    // Before open: aria-expanded="false"
    await expect(pill).toHaveAttribute('aria-expanded', 'false')

    await pill.click()
    await expect(overlay).toBeVisible()

    // After open: aria-expanded="true", overlay has role="dialog"
    await expect(pill).toHaveAttribute('aria-expanded', 'true')
    await expect(overlay).toHaveAttribute('role', 'dialog')
    await expect(overlay).toHaveAttribute('aria-modal', 'true')
  })

})
