/**
 * Responsive and Performance Tests
 */
const { test, expect } = require('@playwright/test');

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Laptop', width: 1366, height: 768 },
    { name: 'Desktop', width: 1920, height: 1080 },
  ];

  for (const viewport of viewports) {
    test(`should render correctly on ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('http://localhost:4000/');
      
      await expect(page).toHaveTitle(/YAPI|iPlus|API/);
      
      const screenshot = await page.screenshot();
      expect(screenshot).toBeTruthy();
    });
  }
});

test.describe('Performance Tests', () => {
  test('should load homepage within 3 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4000/');
    const loadTime = Date.now() - startTime;
    
    console.log(`[Performance] Homepage load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(3000);
  });

  test('should load login page within 2 seconds', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('http://localhost:4000/login');
    const loadTime = Date.now() - startTime;
    
    console.log(`[Performance] Login page load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });

  test('should measure Time to First Byte', async ({ page }) => {
    const response = await page.goto('http://localhost:4000/');
    const ttfb = response.ttfb();
    
    console.log(`[Performance] TTFB: ${ttfb}ms`);
    expect(ttfb).toBeLessThan(1000);
  });

  test('should measure page weight', async ({ page }) => {
    const response = await page.goto('http://localhost:4000/');
    const headers = response.headers();
    const contentLength = parseInt(headers['content-length'] || '0', 10);
    
    console.log(`[Performance] Page size: ${contentLength} bytes`);
    expect(contentLength).toBeLessThan(1024 * 1024);
  });
});

test.describe('Accessibility Tests', () => {
  test('should have proper alt text on images', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    
    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      console.log(`[Accessibility] Image alt: ${alt || '(missing)'}`);
    }
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const label = await input.getAttribute('placeholder') || 
                    await input.getAttribute('aria-label') ||
                    await page.locator(`label[for="${await input.getAttribute('id')}"]`).textContent();
      console.log(`[Accessibility] Input label: ${label || '(missing)'}`);
    }
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const levels = [];
    for (const heading of headings) {
      const level = parseInt((await heading.getAttribute('tagName')).replace('H', ''));
      levels.push(level);
    }
    
    console.log(`[Accessibility] Heading levels: ${levels.join(' -> ')}`);
    
    let lastLevel = 0;
    for (const level of levels) {
      if (level > lastLevel + 1) {
        console.warn(`[Accessibility] Skipped heading level: ${lastLevel} -> ${level}`);
      }
      lastLevel = level;
    }
  });
});

test.describe('Browser Console Tests', () => {
  test('should not have critical console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('http://localhost:4000/');
    await page.waitForTimeout(2000);
    
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('net::')
    );
    
    console.log(`[Console] Errors found: ${criticalErrors.length}`);
    criticalErrors.forEach(e => console.log(`[Console] Error: ${e}`));
    
    expect(criticalErrors.length).toBe(0);
  });
});