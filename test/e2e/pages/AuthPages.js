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
    return this.page.locator('.n-input input, input[placeholder="请输入邮箱或用户名"]').first();
  }

  get passwordInput() {
    return this.page.locator('.n-input input[ type="password"], input[placeholder="请输入密码"]').first();
  }

  get loginButton() {
    return this.page.locator('button:has-text("登录")');
  }

  get registerLink() {
    return this.page.locator('button:has-text("去注册"), a[href="/reg"]');
  }

  get errorMessage() {
    return this.page.locator('.n-message, [class*="error"]');
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

  get usernameInput() {
    return this.page.locator('input[placeholder="请输入用户名"]').first();
  }

  get emailInput() {
    return this.page.locator('input[placeholder="请输入邮箱"]').first();
  }

  get passwordInput() {
    return this.page.locator('input[placeholder="请输入密码"]').first();
  }

  get confirmPasswordInput() {
    return this.page.locator('input[placeholder="请再次输入密码"]').first();
  }

  get registerButton() {
    return this.page.locator('button:has-text("注册")');
  }

  get loginLink() {
    return this.page.locator('button:has-text("去登录"), a[href="/login"]');
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
    return this.page.locator('.logo-icon, [class*="logo"]');
  }

  get header() {
    return this.page.locator('header, .header');
  }

  get loginButton() {
    return this.page.locator('button:has-text("立即登录"), a[href="/login"]');
  }

  get registerButton() {
    return this.page.locator('button:has-text("免费注册"), a[href="/reg"]');
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
    return this.page.locator('input[placeholder*="邮箱"]').first();
  }

  get adminPasswordInput() {
    return this.page.locator('input[type="password"]').first();
  }

  get adminConfirmPasswordInput() {
    return this.page.locator('input[placeholder*="确认密码"]').first();
  }

  get organizationNameInput() {
    return this.page.locator('input[placeholder*="组织名称"], input[name="organizationName"]').first();
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