/**
 * UI Tests - Page rendering and element visibility
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, HomePage, SetupPage } = require('../pages/AuthPages');

test.describe('Home Page UI Tests', () => {
  test('should display homepage elements', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    
    await expect(page).toHaveTitle(/YAPI|iPlus|API/);
    await expect(homePage.logo).toBeVisible();
  });

  test('should display login and register buttons', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    
    await expect(homePage.loginButton).toBeVisible();
    await expect(homePage.registerButton).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.clickLogin();
    
    await expect(page).toHaveURL(/login/);
  });

  test('should navigate to register page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await homePage.clickRegister();
    
    await expect(page).toHaveURL(/reg/);
  });
});

test.describe('Login Page UI Tests', () => {
  test('should display login form elements', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should display register link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    await expect(loginPage.registerLink).toBeVisible();
  });

  test('should show validation error for empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginButton.click();
    
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should navigate to register page from login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.registerLink.click();
    
    await expect(page).toHaveURL(/reg/);
  });
});

test.describe('Register Page UI Tests', () => {
  test('should display register form elements', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.confirmPasswordInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
  });

  test('should display login link', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    
    await expect(registerPage.loginLink).toBeVisible();
  });

  test('should validate password mismatch', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    await registerPage.register('test@example.com', 'password123', 'differentpassword');
    
    await expect(page.locator('text*=不匹配')).toBeVisible();
  });
});

test.describe('Setup Page UI Tests', () => {
  test('should display setup form', async ({ page }) => {
    const setupPage = new SetupPage(page);
    await setupPage.navigate();
    
    await expect(setupPage.adminEmailInput).toBeVisible();
    await expect(setupPage.adminPasswordInput).toBeVisible();
    await expect(setupPage.organizationNameInput).toBeVisible();
    await expect(setupPage.submitButton).toBeVisible();
  });
});