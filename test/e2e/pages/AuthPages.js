/**
 * Page Objects - Login Page
 */
const { TestUtils } = require('../utils/TestUtils');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get emailInput() {
    return this.page.locator('input[type="email"], input[placeholder*="邮箱"], input[name="email"]');
  }

  get passwordInput() {
    return this.page.locator('input[type="password"], input[placeholder*="密码"], input[name="password"]');
  }

  get loginButton() {
    return this.page.locator('button:has-text("登录"), button:has-text("登录")');
  }

  get registerLink() {
    return this.page.locator('a:has-text("注册"), a[href="/reg"]');
  }

  get errorMessage() {
    return this.page.locator('.error-message, .n-message, [class*="error"]');
  }

  async navigate() {
    await this.utils.navigateTo('/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}

class RegisterPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get emailInput() {
    return this.page.locator('input[type="email"], input[name="email"], input[placeholder*="邮箱"]');
  }

  get passwordInput() {
    return this.page.locator('input[type="password"], input[name="password"], input[placeholder*="密码"]');
  }

  get confirmPasswordInput() {
    return this.page.locator('input[name="confirmPassword"], input[placeholder*="确认密码"]');
  }

  get registerButton() {
    return this.page.locator('button:has-text("注册"), button[type="submit"]');
  }

  get loginLink() {
    return this.page.locator('a:has-text("登录"), a[href="/login"]');
  }

  async navigate() {
    await this.utils.navigateTo('/reg');
  }

  async register(email, password, confirmPassword) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
    await this.registerButton.click();
  }
}

class HomePage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get logo() {
    return this.page.locator('.logo, [class*="logo"], svg');
  }

  get header() {
    return this.page.locator('header, .header');
  }

  get loginButton() {
    return this.page.locator('a[href="/login"], button:has-text("登录")');
  }

  get registerButton() {
    return this.page.locator('a[href="/reg"], button:has-text("注册")');
  }

  get searchInput() {
    return this.page.locator('input[type="search"], input[placeholder*="搜索"]');
  }

  async navigate() {
    await this.utils.navigateTo('/');
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async clickRegister() {
    await this.registerButton.click();
  }
}

class SetupPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get adminEmailInput() {
    return this.page.locator('input[name="adminEmail"], input[placeholder*="邮箱"]').first();
  }

  get adminPasswordInput() {
    return this.page.locator('input[name="adminPassword"], input[placeholder*="密码"]').first();
  }

  get adminConfirmPasswordInput() {
    return this.page.locator('input[name="confirmPassword"], input[placeholder*="确认密码"]');
  }

  get organizationNameInput() {
    return this.page.locator('input[name="organizationName"], input[placeholder*="组织名称"]');
  }

  get submitButton() {
    return this.page.locator('button[type="submit"], button:has-text("完成"), button:has-text("提交")');
  }

  async navigate() {
    await this.utils.navigateTo('/setup');
  }

  async setup(adminEmail, password, orgName) {
    await this.adminEmailInput.fill(adminEmail);
    await this.adminPasswordInput.fill(password);
    await this.adminConfirmPasswordInput.fill(password);
    await this.organizationNameInput.fill(orgName);
    await this.submitButton.click();
  }
}

module.exports = { LoginPage, RegisterPage, HomePage, SetupPage };