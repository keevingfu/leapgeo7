import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface PageInfo {
  name: string;
  route: string;
  description: string;
  waitFor?: string; // Optional selector to wait for
}

const pages: PageInfo[] = [
  {
    name: '01-Dashboard',
    route: '/',
    description: 'Main dashboard with KPI metrics and workflow status',
    waitFor: 'text=Welcome to SweetNight GEO System'
  },
  {
    name: '02-Roadmap-Manager',
    route: '/roadmap',
    description: 'Monthly GEO roadmap management with priority levels',
    waitFor: 'text=Roadmap'
  },
  {
    name: '03-Content-Generator',
    route: '/content-generator',
    description: 'Multi-channel content generation interface',
    waitFor: 'text=Content Generator'
  },
  {
    name: '04-Content-Library',
    route: '/content-library',
    description: 'Published content inventory and management',
    waitFor: 'text=Content Library'
  },
  {
    name: '05-Citation-Tracker',
    route: '/citation-tracker',
    description: 'Track citations across 7 AI platforms',
    waitFor: 'text=Citation'
  },
  {
    name: '06-Workflow-Monitor',
    route: '/workflow-monitor',
    description: '7-step GEO workflow automation monitor',
    waitFor: 'text=Workflow'
  },
  {
    name: '07-Prompt-Landscape',
    route: '/prompt-landscape',
    description: 'Knowledge graph visualization of prompt relationships',
    waitFor: 'text=Prompt Landscape'
  },
  {
    name: '08-Analytics-Reports',
    route: '/analytics-reports',
    description: 'Performance analytics and reporting dashboard',
    waitFor: 'text=Analytics'
  },
  {
    name: '09-User-Management',
    route: '/user-management',
    description: 'User account and permission management',
    waitFor: 'text=User'
  },
  {
    name: '10-Settings',
    route: '/settings',
    description: 'System configuration and preferences',
    waitFor: 'text=Settings'
  },
  {
    name: '11-Shopify-GEO',
    route: '/shopify-geo',
    description: 'Shopify platform GEO optimization',
    waitFor: 'text=Shopify'
  },
  {
    name: '12-Amazon-GEO',
    route: '/amazon-geo',
    description: 'Amazon platform GEO optimization',
    waitFor: 'text=Amazon'
  },
  {
    name: '13-YouTube-Videos',
    route: '/youtube-videos',
    description: 'YouTube content management',
    waitFor: 'text=YouTube'
  },
  {
    name: '14-Reddit-Posts',
    route: '/reddit-posts',
    description: 'Reddit content management',
    waitFor: 'text=Reddit'
  },
  {
    name: '15-Medium-Articles',
    route: '/medium-articles',
    description: 'Medium article management',
    waitFor: 'text=Medium'
  }
];

async function captureScreenshots() {
  const screenshotDir = path.join(__dirname, '../screenshots');

  // Create screenshots directory if it doesn't exist
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log('🚀 Starting screenshot capture for LeapGEO7...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  const page = await context.newPage();
  const baseUrl = 'http://localhost:5173';

  let successCount = 0;
  let failCount = 0;
  const results: Array<{ name: string; status: string; error?: string }> = [];

  for (const pageInfo of pages) {
    try {
      console.log(`📸 Capturing: ${pageInfo.name}...`);

      // Navigate to page
      await page.goto(`${baseUrl}${pageInfo.route}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for specific element if specified
      if (pageInfo.waitFor) {
        try {
          await page.waitForSelector(pageInfo.waitFor, { timeout: 5000 });
        } catch (e) {
          console.log(`  ⚠️  Warning: Element "${pageInfo.waitFor}" not found, continuing...`);
        }
      }

      // Wait a bit for animations and content to load
      await page.waitForTimeout(2000);

      // Take full page screenshot
      const screenshotPath = path.join(screenshotDir, `${pageInfo.name}.png`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      console.log(`  ✅ Saved: ${pageInfo.name}.png`);
      successCount++;
      results.push({ name: pageInfo.name, status: 'success' });

    } catch (error) {
      console.error(`  ❌ Failed: ${pageInfo.name}`);
      console.error(`     Error: ${error.message}`);
      failCount++;
      results.push({
        name: pageInfo.name,
        status: 'failed',
        error: error.message
      });
    }
  }

  await browser.close();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Screenshot Capture Summary');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${successCount}/${pages.length}`);
  console.log(`❌ Failed: ${failCount}/${pages.length}`);
  console.log(`📁 Location: ${screenshotDir}`);
  console.log('='.repeat(60) + '\n');

  // Save results to JSON
  const resultsPath = path.join(screenshotDir, 'screenshot-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    totalPages: pages.length,
    successCount,
    failCount,
    results,
    pages: pages.map(p => ({
      name: p.name,
      route: p.route,
      description: p.description
    }))
  }, null, 2));

  console.log(`📄 Results saved to: screenshot-results.json\n`);

  return { successCount, failCount, results };
}

// Run the script
captureScreenshots()
  .then(({ successCount, failCount }) => {
    process.exit(failCount > 0 ? 1 : 0);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
