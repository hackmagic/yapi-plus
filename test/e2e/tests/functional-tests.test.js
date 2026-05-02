/**
 * Functional Tests - API and data flow tests
 */
const { test, expect } = require('@playwright/test');
const { LoginPage, SetupPage } = require('../pages/AuthPages');
const { 
  ProjectListPage, 
  AddProjectPage, 
  InterfaceListPage,
  InterfaceEditPage 
} = require('../pages/ProjectPages');

test.describe('Authentication Flow Tests', () => {
  test('should login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin@admin.com', 'ymfe.org');
    
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).not.toContain('login');
  });

  test('should reject login with invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrongpassword');
    
    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[type="email"], input[name="email"]', 'admin@admin.com');
    await page.fill('input[type="password"], input[name="password"]', 'ymfe.org');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(2000);
    
    await page.click('[class*="user"], [class*="avatar"]');
    await page.click('button:has-text("退出"), button:has-text("登出")');
    await page.waitForTimeout(1000);
    
    const url = page.url();
    expect(url).toContain('login') || url === 'http://localhost:4000/';
  });
});

test.describe('Project Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin@admin.com', 'ymfe.org');
    await page.waitForTimeout(2000);
  });

  test('should navigate to project list', async ({ page }) => {
    const projectList = new ProjectListPage(page);
    await projectList.navigate(1);
    
    await expect(page).toHaveURL(/project|group/);
  });

  test('should display add project button', async ({ page }) => {
    const projectList = new ProjectListPage(page);
    await projectList.navigate(1);
    
    await expect(projectList.addProjectButton).toBeVisible();
  });

  test('should create a new project', async ({ page }) => {
    const addProject = new AddProjectPage(page);
    await addProject.navigate();
    await addProject.createProject('Test Project ' + Date.now(), 'This is a test project');
    
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('project');
  });

  test('should list existing projects', async ({ page }) => {
    const projectList = new ProjectListPage(page);
    await projectList.navigate(1);
    
    const names = await projectList.getProjectNames();
    expect(names).toBeTruthy();
  });
});

test.describe('Interface Management Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('admin@admin.com', 'ymfe.org');
    await page.waitForTimeout(2000);
  });

  test('should navigate to interface list', async ({ page }) => {
    const interfaceList = new InterfaceListPage(page);
    await interfaceList.navigate(1);
    
    await expect(page).toHaveURL(/interface/);
  });

  test('should display add interface button', async ({ page }) => {
    const interfaceList = new InterfaceListPage(page);
    await interfaceList.navigate(1);
    
    await expect(interfaceList.addInterfaceButton).toBeVisible();
  });

  test('should create a new interface', async ({ page }) => {
    const interfaceList = new InterfaceListPage(page);
    await interfaceList.navigate(1);
    await interfaceList.clickAddInterface();
    
    const interfaceEdit = new InterfaceEditPage(page);
    await interfaceEdit.createInterface('GET', '/api/test' + Date.now(), 'Test endpoint');
    
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url).toContain('interface');
  });

  test('should search interfaces', async ({ page }) => {
    const interfaceList = new InterfaceListPage(page);
    await interfaceList.navigate(1);
    await interfaceList.searchInterface('test');
    
    await page.waitForTimeout(1000);
    await expect(interfaceList.searchInput).toHaveValue('test');
  });
});

test.describe('API Response Tests', () => {
  test('should handle 404 gracefully', async ({ page }) => {
    const response = await page.request.get('http://localhost:4000/nonexistent');
    expect(response.status()).toBe(404);
  });

  test('should handle API timeout', async ({ page }) => {
    await page.route('**/api/slow', async route => {
      await new Promise(resolve => setTimeout(resolve, 30000));
      await route.continue();
    });
    
    await page.goto('http://localhost:4000/');
    await expect(page).toHaveTitle(/YAPI|iPlus|API/);
  });
});