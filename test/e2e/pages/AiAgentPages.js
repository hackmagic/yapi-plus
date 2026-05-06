/**
 * Page Objects - AI Agent Page
 */
const { TestUtils } = require('../utils/TestUtils');

class AiAgentPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get addAssistantButton() {
    return this.page.locator('button:has-text("添加助手"), button:has-text("新建助手")');
  }

  get assistantList() {
    return this.page.locator('[class*="assistant"], .assistant-item');
  }

  get nameInput() {
    return this.page.locator('input[name="name"], input[placeholder*="名称"]');
  }

  get descriptionInput() {
    return this.page.locator('textarea[name="description"], textarea[placeholder*="描述"]');
  }

  get typeSelect() {
    return this.page.locator('select[name="type"], .n-select');
  }

  get apiKeyInput() {
    return this.page.locator('input[name="apiKey"], input[placeholder*="API Key"]');
  }

  get modelInput() {
    return this.page.locator('input[name="model"], input[placeholder*="模型"]');
  }

  get baseURLInput() {
    return this.page.locator('input[name="baseURL"], input[placeholder*="Base URL"]');
  }

  get temperatureInput() {
    return this.page.locator('input[name="temperature"]');
  }

  get maxTokensInput() {
    return this.page.locator('input[name="maxTokens"]');
  }

  get saveButton() {
    return this.page.locator('button[type="submit"], button:has-text("保存"), button:has-text("确定")');
  }

  get testButton() {
    return this.page.locator('button:has-text("测试")');
  }

  get deleteButton() {
    return this.page.locator('button[title*="删除"], button[class*="delete"]');
  }

  get chatInput() {
    return this.page.locator('textarea[placeholder*="输入"], input[placeholder*="消息"]');
  }

  get sendButton() {
    return this.page.locator('button:has-text("发送"), button[type="submit"]');
  }

  get chatMessages() {
    return this.page.locator('[class*="message"], .chat-message, [class*="content"]');
  }

  get responseContent() {
    return this.page.locator('[class*="response"], .response-content, [class*="answer"]');
  }

  async navigate() {
    await this.utils.navigateTo('/ai-agent');
  }

  async createAssistant(config) {
    await this.addAssistantButton.click();
    if (config.name) await this.nameInput.fill(config.name);
    if (config.description) await this.descriptionInput.fill(config.description);
    if (config.type) await this.typeSelect.selectOption(config.type);
    if (config.apiKey) await this.apiKeyInput.fill(config.apiKey);
    if (config.model) await this.modelInput.fill(config.model);
    if (config.baseURL) await this.baseURLInput.fill(config.baseURL);
    if (config.temperature) await this.temperatureInput.fill(String(config.temperature));
    if (config.maxTokens) await this.maxTokensInput.fill(String(config.maxTokens));
    await this.saveButton.click();
  }

  async deleteAssistant(name) {
    const assistant = this.assistantList.filter({ hasText: name });
    await assistant.locator(this.deleteButton).click();
  }

  async sendMessage(message) {
    await this.chatInput.fill(message);
    await this.sendButton.click();
  }

  async getLastResponse() {
    const messages = await this.chatMessages.all();
    const lastMessage = messages[messages.length - 1];
    return await lastMessage.locator(this.responseContent).textContent();
  }

  async testAssistant(config) {
    if (config.apiKey) await this.apiKeyInput.fill(config.apiKey);
    if (config.model) await this.modelInput.fill(config.model);
    if (config.baseURL) await this.baseURLInput.fill(config.baseURL);
    await this.testButton.click();
    await this.page.waitForTimeout(5000);
    return await this.responseContent.textContent();
  }
}

class UserSettingsPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get usernameInput() {
    return this.page.locator('input[name="username"], input[placeholder*="用户名"]').first();
  }

  get emailInput() {
    return this.page.locator('input[name="email"], input[placeholder*="邮箱"]').first();
  }

  get oldPasswordInput() {
    return this.page.locator('input[placeholder*="原密码"], input[placeholder*="旧密码"]').first();
  }

  get newPasswordInput() {
    return this.page.locator('input[placeholder*="新密码"]').first();
  }

  get confirmPasswordInput() {
    return this.page.locator('input[placeholder*="确认密码"]').first();
  }

  get saveButton() {
    return this.page.locator('button[type="submit"], button:has-text("保存")').first();
  }

  get changePasswordButton() {
    return this.page.locator('button:has-text("修改密码"), button:has-text("更改密码")').first();
  }

  get avatarUpload() {
    return this.page.locator('input[type="file"], [class*="avatar"]');
  }

  async navigate() {
    await this.utils.navigateTo('/user/profile');
  }

  async updateProfile(username, email) {
    if (username) await this.usernameInput.fill(username);
    if (email) await this.emailInput.fill(email);
    await this.saveButton.click();
  }

  async changePassword(oldPassword, newPassword) {
    if (await this.oldPasswordInput.isVisible().catch(() => false)) {
      await this.oldPasswordInput.fill(oldPassword);
    }
    if (await this.newPasswordInput.isVisible().catch(() => false)) {
      await this.newPasswordInput.fill(newPassword);
    }
    if (await this.confirmPasswordInput.isVisible().catch(() => false)) {
      await this.confirmPasswordInput.fill(newPassword);
    }
    const btn = await this.changePasswordButton.isVisible().catch(() => false)
      ? this.changePasswordButton
      : this.saveButton;
    await btn.click();
  }
}

class SystemSettingsPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get mailSettingTab() {
    return this.page.locator('button:has-text("邮件设置"), [role="tab"]:has-text("邮件")');
  }

  get databaseTab() {
    return this.page.locator('button:has-text("数据库设置"), [role="tab"]:has-text("数据库")');
  }

  get adminTab() {
    return this.page.locator('button:has-text("管理员设置"), [role="tab"]:has-text("管理员")');
  }

  get smtpHostInput() {
    return this.page.locator('input[name="smtpHost"], input[placeholder*="SMTP"], input[placeholder*="smtp"]').first();
  }

  get smtpPortInput() {
    return this.page.locator('input[name="smtpPort"], input[placeholder*="端口"]').first();
  }

  get smtpUserInput() {
    return this.page.locator('input[name="smtpUser"], input[placeholder*="用户名"]').first();
  }

  get smtpPassInput() {
    return this.page.locator('input[name="smtpPass"], input[placeholder*="密码"]').first();
  }

  get saveButton() {
    return this.page.locator('button[type="submit"], button:has-text("保存")');
  }

  async navigate() {
    await this.utils.navigateTo('/system-settings');
  }

  async updateMailSettings(config) {
    await this.mailSettingTab.click().catch(() => {});
    await this.page.waitForTimeout(500);
    await this.smtpHostInput.fill(config.host || '');
    await this.smtpPortInput.fill(String(config.port || ''));
    await this.smtpUserInput.fill(config.user || '');
    await this.smtpPassInput.fill(config.pass || '');
    await this.saveButton.click();
  }

  async saveConfig(configData) {
    // Uses unified /api/config/save endpoint
    const response = await this.page.request.post('http://localhost:4000/api/config/save', {
      data: configData
    });
    return response;
  }
}

module.exports = { AiAgentPage, UserSettingsPage, SystemSettingsPage };