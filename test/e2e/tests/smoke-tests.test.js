const { test, expect } = require('@playwright/test');

test.describe('Basic Smoke Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    await expect(page).toHaveTitle(/YAPI|iPlus|API|登录|Login/);
  });

  test('should load login page', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="邮箱"]');
    await expect(emailInput).toBeVisible();
  });

  test('should load register page', async ({ page }) => {
    await page.goto('http://localhost:4000/reg');
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="邮箱"]');
    await expect(emailInput).toBeVisible();
  });
});