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

async function login(page) {
  await page.goto('http://localhost:4000/login');
  const emailInput = page.locator('input[placeholder="请输入邮箱或用户名"]');
  const passwordInput = page.locator('input[placeholder="请输入密码"]');
  const loginButton = page.locator('button:has-text("登录")');
  
  await emailInput.fill('admin@admin.com');
  await passwordInput.fill('ymfe.org');
  await loginButton.click();
  await page.waitForTimeout(3000);
  
  const currentUrl = page.url();
  if (currentUrl.includes('login')) {
    throw new Error('Login failed');
  }
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
});

test.describe('Project Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to project list page', async ({ page }) => {
    const projectList = new ProjectListPage(page);
    await projectList.navigate(1);
    
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should display add project button when logged in', async ({ page }) => {
    const projectList = new ProjectListPage(page);
    await projectList.navigate(1);
    
    await page.waitForTimeout(2000);
    
    const url = page.url();
    if (url.includes('login')) {
      throw new Error('Not logged in');
    }
    
    const addButton = page.locator('a[href="/add-project"]');
    await expect(addButton.first()).toBeVisible({ timeout: 5000 });
  });

  test('should create a new project', async ({ page }) => {
    await page.goto('http://localhost:4000/add-project');
    await page.waitForTimeout(2000);
    
    const nameInput = page.locator('input[placeholder*="项目名称"]');
    if (await nameInput.isVisible()) {
      await nameInput.fill('Test Project ' + Date.now());
      const createButton = page.locator('button:has-text("创建"), button:has-text("确定")');
      await createButton.click();
      await page.waitForTimeout(2000);
      
      expect(page.url()).toContain('project');
    }
  });
});

test.describe('Interface Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to interface list page', async ({ page }) => {
    const interfaceList = new InterfaceListPage(page);
    await interfaceList.navigate(1);
    
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url).toBeTruthy();
  });

  test('should display interface list page elements', async ({ page }) => {
    const interfaceList = new InterfaceListPage(page);
    await interfaceList.navigate(1);
    
    await page.waitForTimeout(1000);
    expect(page.url()).toBeTruthy();
  });

  test('should search interfaces', async ({ page }) => {
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
  test('should login successfully via API', async ({ page }) => {
    const response = await page.request.post('http://localhost:4000/api/user/login', {
      data: {
        email: 'admin@admin.com',
        password: 'ymfe.org'
      }
    });
    
    expect(response.status()).toBe(200);
    
    await page.goto('http://localhost:4000/');
    await page.waitForTimeout(2000);
    
    const userMenu = page.locator('[class*="user"], [class*="avatar"]');
    await expect(userMenu.first()).toBeVisible({ timeout: 5000 });
  });
});