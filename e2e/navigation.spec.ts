import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Page Navigation
 * Tests basic navigation and page load for all 15 pages
 */

const pages = [
  { path: '/dashboard', title: 'Dashboard', heading: 'Dashboard' },
  { path: '/roadmap', title: 'Roadmap Manager', heading: 'Roadmap Manager' },
  { path: '/prompts', title: 'Prompt Landscape', heading: 'Prompt Landscape' },
  { path: '/content', title: 'Content Registry', heading: 'Content Registry' },
  { path: '/generator', title: 'Content Generator', heading: 'Content Generator' },
  { path: '/citations', title: 'Citation Tracker', heading: 'Citation Tracker' },
  { path: '/citation-strength', title: 'Citation Strength', heading: 'Citation Strength' },
  { path: '/kpi', title: 'KPI Dashboard', heading: 'KPI Dashboard' },
  { path: '/workflow', title: 'Workflow Monitor', heading: 'Workflow Monitor' },
  { path: '/battlefield', title: 'Battlefield Map', heading: 'Battlefield Map' },
  { path: '/coverage', title: 'Content Coverage', heading: 'Content Coverage' },
  { path: '/settings', title: 'System Settings', heading: 'System Settings' },
  { path: '/templates', title: 'Template Editor', heading: 'Template Editor' },
  { path: '/reports', title: 'Analytics Reports', heading: 'Analytics Reports' },
  { path: '/users', title: 'User Management', heading: 'User Management' },
];

test.describe('Page Navigation Tests', () => {
  pages.forEach(({ path, title, heading }) => {
    test(`should navigate to ${title}`, async ({ page }) => {
      // Navigate and wait for network to be idle
      await page.goto(path, { waitUntil: 'networkidle' });

      // Wait for React hydration and rendering
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1500);

      // Wait for any h1 or h4 heading to be visible (pages use different levels)
      await page.waitForSelector('h1, h4', { timeout: 10000 });

      // Check page heading contains expected text (case insensitive, first 2 words)
      const headingLocator = page.locator('h1, h4').first();
      await expect(headingLocator).toBeVisible({ timeout: 5000 });

      const headingText = await headingLocator.textContent();
      const expectedWords = heading.split(' ').slice(0, 2).join(' ');
      expect(headingText?.toLowerCase()).toContain(expectedWords.toLowerCase());
    });
  });

  test('should navigate between pages using sidebar', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await page.waitForLoadState('domcontentloaded');

    // Find sidebar navigation link (NavLink renders as <a> inside Drawer)
    const navLink = page.locator('a[href="/roadmap"]').first();
    await expect(navLink).toBeVisible({ timeout: 5000 });

    await navLink.click();
    await page.waitForLoadState('networkidle');

    // Verify navigation occurred to roadmap page
    expect(page.url()).toContain('/roadmap');
  });
});
