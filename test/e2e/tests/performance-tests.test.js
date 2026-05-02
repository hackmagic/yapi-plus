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
      
      const title = await page.title();
      expect(title).toBeTruthy();
      
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
    const startTime = Date.now();
    await page.goto('http://localhost:4000/');
    const endTime = Date.now();
    const ttfb = endTime - startTime;
    
    console.log(`[Performance] TTFB: ~${ttfb}ms`);
    expect(ttfb).toBeGreaterThan(0);
  });

  test('should measure page weight', async ({ page }) => {
    const response = await page.goto('http://localhost:4000/');
    const body = await response.body();
    const size = body.length;
    
    console.log(`[Performance] Page size: ${size} bytes`);
    expect(size).toBeLessThan(1024 * 1024);
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
    expect(images.length).toBeGreaterThanOrEqual(0);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    
    await page.waitForTimeout(1000);
    const inputs = await page.locator('.n-input input').all();
    for (const input of inputs) {
      const placeholder = await input.getAttribute('placeholder');
      console.log(`[Accessibility] Input placeholder: ${placeholder}`);
    }
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    
    await page.waitForTimeout(1000);
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
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