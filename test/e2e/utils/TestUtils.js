/**
 * Test utilities - Base test class with common operations
 */
const { test as base, expect } = require('@playwright/test');

class TestUtils {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.TEST_BASE_URL || 'http://localhost:4000';
  }

  async navigateTo(path) {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  async waitForSelector(selector, options = {}) {
    await this.page.waitForSelector(selector, { timeout: 10000, ...options });
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async fill(selector, value) {
    await this.page.fill(selector, value);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  async waitForNavigation(callback) {
    await this.page.waitForNavigation(callback);
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  async getByRole(role, options = {}) {
    return this.page.getByRole(role, options);
  }

  async getByText(text, options = {}) {
    return this.page.getByText(text, options);
  }

  async getByLabel(text, options = {}) {
    return this.page.getByLabel(text, options);
  }

  async getByPlaceholder(text, options = {}) {
    return this.page.getByPlaceholder(text, options);
  }

  async mockAPI(url, response, method = 'GET') {
    await this.page.route(url, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      });
    });
  }

  async waitForAPIResponse(url, options = {}) {
    await this.page.waitForResponse(
      response => response.url().includes(url) && response.status() === 200,
      options
    );
  }

  async evaluateScript(script) {
    return await this.page.evaluate(script);
  }

  async consoleLog() {
    this.page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
  }
}

module.exports = { TestUtils, expect };