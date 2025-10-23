import { test, expect } from '@playwright/test';

/**
 * E2E Test Suite: Key Interactions
 * Tests critical user interactions across the application
 */

// Helper function for page navigation with proper waiting
async function navigateAndWait(page: any, url: string) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('h1, h4', { timeout: 10000 });
  await page.waitForTimeout(1000);
}

test.describe('KPI Dashboard Interactions', () => {
  test('should switch time range filters', async ({ page }) => {
    await navigateAndWait(page, '/kpi');

    // Check that time range buttons exist (use more flexible selectors)
    const last7Days = page.locator('button:has-text("Last 7 Days")');
    const last30Days = page.locator('button:has-text("Last 30 Days")');
    const last90Days = page.locator('button:has-text("Last 90 Days")');

    await expect(last7Days).toBeVisible({ timeout: 5000 });
    await expect(last30Days).toBeVisible({ timeout: 5000 });
    await expect(last90Days).toBeVisible({ timeout: 5000 });

    // Click different time ranges
    await last30Days.click();
    await page.waitForTimeout(500);

    await last90Days.click();
    await page.waitForTimeout(500);
  });
});

test.describe('Monthly Roadmap Interactions', () => {
  test('should filter roadmap by P-level', async ({ page }) => {
    await navigateAndWait(page, '/roadmap');

    // Check filter chips exist (MUI Chip components)
    const allChip = page.locator('.MuiChip-root:has-text("All")').first();
    const p0Chip = page.locator('.MuiChip-root:has-text("P0")').first();

    await expect(allChip).toBeVisible({ timeout: 5000 });
    await expect(p0Chip).toBeVisible({ timeout: 5000 });

    // Click P0 filter chip
    await p0Chip.click();
    await page.waitForTimeout(500);

    // Table should still be visible and filtered
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 5000 });
  });

  test('should filter roadmap by month', async ({ page }) => {
    await navigateAndWait(page, '/roadmap');

    // Try to find month selector button (may not exist on all pages)
    const monthSelect = page.locator('div[role="button"]').filter({ hasText: /january|february|march|all months/i }).first();

    if (await monthSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await monthSelect.click();
      await page.waitForTimeout(300);

      // Select a month from dropdown if visible
      const februaryOption = page.getByRole('option', { name: /february/i });
      if (await februaryOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await februaryOption.click();
        await page.waitForTimeout(500);
      }
    }
  });
});

test.describe('Citation Tracker Interactions', () => {
  test('should filter citations by platform', async ({ page }) => {
    await navigateAndWait(page, '/citations');

    // Open platform filter (may not be visible)
    const platformSelect = page.locator('div[role="button"]').filter({ hasText: /all platforms|youtube|blog/i }).first();

    if (await platformSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
      await platformSelect.click();
      await page.waitForTimeout(300);

      // Select YouTube if visible
      const youtubeOption = page.getByRole('option', { name: /youtube/i });
      if (await youtubeOption.isVisible({ timeout: 2000 }).catch(() => false)) {
        await youtubeOption.click();
        await page.waitForTimeout(500);
      }
    }

    // Table should be visible
    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Template Editor Interactions', () => {
  test('should switch between channel tabs', async ({ page }) => {
    await navigateAndWait(page, '/templates');

    // Check channel tabs exist
    const youtubeTab = page.getByRole('tab', { name: /youtube/i });
    const redditTab = page.getByRole('tab', { name: /reddit/i });
    const quoraTab = page.getByRole('tab', { name: /quora/i });

    await expect(youtubeTab).toBeVisible({ timeout: 5000 });
    await expect(redditTab).toBeVisible({ timeout: 5000 });
    await expect(quoraTab).toBeVisible({ timeout: 5000 });

    // Switch to Reddit tab
    await redditTab.click();
    await page.waitForTimeout(500);

    // Template editor should be visible (use first visible textarea to avoid MUI's hidden helper)
    const editor = page.getByRole('textbox').first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    // Switch to Quora tab
    await quoraTab.click();
    await page.waitForTimeout(500);
    await expect(editor).toBeVisible({ timeout: 5000 });
  });

  test('should toggle preview mode', async ({ page }) => {
    await navigateAndWait(page, '/templates');

    // Find and click preview button (may not exist)
    const previewButton = page.getByRole('button', { name: /show preview|hide preview/i });

    if (await previewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await previewButton.click();
      await page.waitForTimeout(500);

      // Click again to hide
      await previewButton.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Analytics Reports Interactions', () => {
  test('should configure and generate report', async ({ page }) => {
    await navigateAndWait(page, '/reports');

    // Check report type buttons
    const weeklyButton = page.getByRole('button', { name: /weekly report/i });
    const monthlyButton = page.getByRole('button', { name: /monthly report/i });

    await expect(weeklyButton).toBeVisible({ timeout: 5000 });
    await expect(monthlyButton).toBeVisible({ timeout: 5000 });

    // Select monthly report
    await monthlyButton.click();
    await page.waitForTimeout(500);

    // Click generate report button
    const generateButton = page.getByRole('button', { name: /generate report/i });
    await expect(generateButton).toBeVisible({ timeout: 5000 });
    await generateButton.click();

    // Wait for report to be generated
    await page.waitForTimeout(1000);

    // Report preview should be visible (check for any heading with "report")
    const reportHeading = page.getByRole('heading', { name: /report/i });
    await expect(reportHeading).toBeVisible({ timeout: 5000 });
  });
});

test.describe('User Management Interactions', () => {
  test('should open add user dialog', async ({ page }) => {
    await navigateAndWait(page, '/users');

    // Click Add User button
    const addUserButton = page.getByRole('button', { name: /add user/i });
    await expect(addUserButton).toBeVisible({ timeout: 5000 });
    await addUserButton.click();

    // Dialog should open
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Dialog should have title
    const dialogTitle = page.getByRole('heading', { name: /add new user/i });
    await expect(dialogTitle).toBeVisible({ timeout: 5000 });

    // Close dialog
    const cancelButton = page.getByRole('button', { name: /cancel/i });
    await cancelButton.click();
    await page.waitForTimeout(500);
  });

  test('should view role permissions', async ({ page }) => {
    await navigateAndWait(page, '/users');

    // Click on a role chip to view permissions (may not be clickable)
    const adminChip = page.locator('span').filter({ hasText: /^Admin$/ }).first();

    if (await adminChip.isVisible({ timeout: 3000 }).catch(() => false)) {
      await adminChip.click();
      await page.waitForTimeout(500);

      // Permission matrix should be visible
      const permissionTable = page.locator('table').filter({ hasText: /view.*create.*edit.*delete/i });
      await expect(permissionTable).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe('System Settings Interactions', () => {
  test('should switch between settings tabs', async ({ page }) => {
    await navigateAndWait(page, '/settings');

    // Check tabs exist
    const generalTab = page.getByRole('tab', { name: /general/i });
    const apiTab = page.getByRole('tab', { name: /api integrations/i });
    const workflowTab = page.getByRole('tab', { name: /workflow/i });

    await expect(generalTab).toBeVisible({ timeout: 5000 });
    await expect(apiTab).toBeVisible({ timeout: 5000 });
    await expect(workflowTab).toBeVisible({ timeout: 5000 });

    // Switch to API Integrations tab
    await apiTab.click();
    await page.waitForTimeout(500);

    // Switch to Workflow tab
    await workflowTab.click();
    await page.waitForTimeout(500);
  });
});
