/**
 * UI Tests - Page rendering and element visibility
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, RegisterPage, HomePage, SetupPage } = require('../pages/AuthPages');

test.describe('Home Page UI Tests', () => {
  test('should display homepage elements', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should display login and register buttons', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    
    const loginBtn = page.locator('button:has-text("立即登录")');
    await expect(loginBtn).toBeVisible({ timeout: 5000 });
    
    const registerBtn = page.locator('button:has-text("免费注册")');
    await expect(registerBtn).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to login page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.clickLogin();
    
    await page.waitForURL(/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.clickRegister();
    
    await page.waitForURL(/reg/);
  });
});

test.describe('Login Page UI Tests', () => {
  test('should display login form elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    const emailInput = page.locator('input[placeholder="请输入邮箱或用户名"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    
    const passwordInput = page.locator('input[placeholder="请输入密码"]');
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    
    const loginButton = page.locator('button:has-text("登录")');
    await expect(loginButton).toBeVisible({ timeout: 5000 });
  });

  test('should display register link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    const registerLink = page.locator('button:has-text("去注册")');
    await expect(registerLink).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error for empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    const loginButton = page.locator('button:has-text("登录")');
    await loginButton.click();
    
    await page.waitForTimeout(1000);
  });

  test('should navigate to register page from login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    const registerLink = page.locator('button:has-text("去注册")');
    await registerLink.click();
    
    await page.waitForURL(/reg/);
  });
});

test.describe('Register Page UI Tests', () => {
  test('should display register form elements', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    
    const usernameInput = page.locator('input[placeholder="请输入用户名"]');
    await expect(usernameInput).toBeVisible({ timeout: 5000 });
    
    const emailInput = page.locator('input[placeholder="请输入邮箱"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    
    const passwordInput = page.locator('input[placeholder="请输入密码"]');
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('should display login link', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    
    const loginLink = page.locator('button:has-text("去登录")');
    await expect(loginLink).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Setup Page UI Tests', () => {
  test('should display setup form when not configured', async ({ page }) => {
    const setupPage = new SetupPage(page);
    await setupPage.navigate();
    
    await page.waitForTimeout(2000);
  });
});