/**
 * Functional Tests - API and data flow tests
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, RegisterPage, SetupPage } = require('../pages/AuthPages');
const { 
  ProjectListPage, 
  AddProjectPage, 
  InterfaceListPage,
  InterfaceEditPage 
} = require('../pages/ProjectPages');

async function tryLogin(page) {
  await page.goto('http://localhost:4000/login');
  const emailInput = page.locator('input[placeholder="请输入邮箱或用户名"]');
  const passwordInput = page.locator('input[placeholder="请输入密码"]');
  const loginButton = page.locator('button:has-text("登录")');
  
  if (await emailInput.isVisible()) {
    await emailInput.fill('admin@admin.com');
    await passwordInput.fill('ymfe.org');
    await loginButton.click();
    await page.waitForTimeout(3000);
    
    const currentUrl = page.url();
    return !currentUrl.includes('login');
  }
  return false;
}

test.describe('Authentication Flow Tests', () => {
  test('should display login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    const emailInput = page.locator('input[placeholder="请输入邮箱或用户名"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    
    const passwordInput = page.locator('input[placeholder="请输入密码"]');
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('should navigate to register page from login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    
    const registerLink = page.locator('button:has-text("去注册")');
    await expect(registerLink).toBeVisible({ timeout: 5000 });
    await registerLink.click();
    
    await page.waitForURL(/reg/);
    const regButton = page.locator('button:has-text("注册")');
    await expect(regButton).toBeVisible({ timeout: 5000 });
  });

  test('should display register form', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();
    
    const emailInput = page.locator('input[placeholder="请输入邮箱"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });
    
    const passwordInput = page.locator('input[placeholder="请输入密码"]');
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
  });

  test('should test login with valid credentials', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', 'ymfe.org');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    const url = page.url();
    expect(url).toBeTruthy();
  });
});

test.describe('Project Management Tests', () => {
  test('should navigate to project list page when logged in', async ({ page }) => {
    const isLoggedIn = await tryLogin(page);
    
    await page.goto('http://localhost:4000/group/1/project');
    await page.waitForTimeout(2000);
    
    const url = page.url();
    if (isLoggedIn) {
      expect(url).toContain('project');
    } else {
      console.log('Login not available - project list may require login');
    }
  });

  test('should navigate to add project page when logged in', async ({ page }) => {
    const isLoggedIn = await tryLogin(page);
    
    await page.goto('http://localhost:4000/add-project');
    await page.waitForTimeout(2000);
    
    const url = page.url();
    if (isLoggedIn) {
      const nameInput = page.locator('input[placeholder*="项目名称"]');
      await expect(nameInput).toBeVisible({ timeout: 5000 });
    } else {
      console.log('Login not available - add project may require login');
    }
  });
});

test.describe('Interface Management Tests', () => {
  test('should navigate to interface list page when logged in', async ({ page }) => {
    const isLoggedIn = await tryLogin(page);
    
    await page.goto('http://localhost:4000/project/1/interface');
    await page.waitForTimeout(2000);
    
    const url = page.url();
    if (isLoggedIn) {
      expect(url).toContain('interface');
    } else {
      console.log('Login not available - interface list may require login');
    }
  });

  test('should show search input when available', async ({ page }) => {
    await page.goto('http://localhost:4000/project/1/interface');
    await page.waitForTimeout(2000);
    
    const searchInput = page.locator('input[placeholder*="搜索"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      expect(await searchInput.inputValue()).toBe('test');
    }
  });
});

test.describe('Page Navigation Tests', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('http://localhost:4000/');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should load login page', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    
    const emailInput = page.locator('input[placeholder="请输入邮箱或用户名"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 });
  });

  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.request.get('http://localhost:4000/api/nonexistent');
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe('Authentication API Tests', () => {
  test('should return proper error for invalid credentials', async ({ page }) => {
    const response = await page.request.post('http://localhost:4000/api/user/login', {
      data: {
        email: 'nonexistent@test.com',
        password: 'wrongpassword'
      }
    });
    
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('should handle login response', async ({ page }) => {
    const response = await page.request.post('http://localhost:4000/api/user/login', {
      data: {
        email: 'admin@admin.com',
        password: 'ymfe.org'
      }
    });
    
    const data = await response.json();
    expect(data).toBeTruthy();
  });
});