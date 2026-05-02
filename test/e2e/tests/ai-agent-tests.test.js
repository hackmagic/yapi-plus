/**
 * AI Agent Automated Tests
 * 使用AI Agent测试框架进行自动化测试
 */
const { test, expect } = require('@playwright/test');
const { 
  AIAgentTestFramework, 
  AI_TEST_CASES, 
  runAITests 
} = require('../ai-agent-framework');

test.describe('AI Agent Framework Tests', () => {
  test('should create framework instance', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    expect(framework).toBeTruthy();
    expect(framework.testConfig.baseURL).toBeTruthy();
  });

  test('should generate test from natural language', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    
    const testCase = framework.generateTestCaseFromNaturalLanguage(
      '测试用户登录功能，首先打开登录页面，然后输入用户名密码，点击登录按钮，验证是否成功跳转'
    );
    
    expect(testCase.name).toBeTruthy();
    expect(testCase.steps).toBeTruthy();
    expect(testCase.assertions).toBeTruthy();
  });

  test('should export json report', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    
    await framework.executeTestCase({
      name: 'Test',
      steps: [{ action: 'navigate', value: '/login' }],
      assertions: [],
    });
    
    const jsonReport = framework.exportReport('json');
    expect(jsonReport).toBeTruthy();
    expect(jsonReport).toContain('passed');
  });

  test('should export html report', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    
    await framework.executeTestCase({
      name: 'Test',
      steps: [{ action: 'navigate', value: '/login' }],
      assertions: [],
    });
    
    const htmlReport = framework.exportReport('html');
    expect(htmlReport).toContain('AI Agent Test Report');
  });
});

test.describe('AI Agent Navigation Tests', () => {
  test('should navigate to homepage', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    
    await framework.executeTestCase({
      name: 'Navigate to homepage',
      steps: [
        { action: 'navigate', value: '/' },
        { action: 'wait', value: 1000 },
      ],
      assertions: [
        { type: 'urlContains', expected: 'localhost' },
      ],
    });
    
    const summary = framework.getTestSummary();
    expect(summary.total).toBe(1);
  });

  test('should execute project list test case', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    await framework.executeTestCase(AI_TEST_CASES.projectManagement.viewProjectList);
    
    const summary = framework.getTestSummary();
    expect(summary.total).toBe(1);
  });
});

test.describe('AI Agent Integration Tests', () => {
  test('should run login test case', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    
    await framework.executeTestCase({
      name: 'Test login',
      steps: [
        { action: 'navigate', value: '/login' },
        { action: 'wait', value: 1000 },
      ],
      assertions: [],
    });
    
    const summary = framework.getTestSummary();
    expect(summary.total).toBe(1);
  });

  test('should run create project test', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    await framework.executeTestCase(AI_TEST_CASES.projectManagement.createProject);
    
    const summary = framework.getTestSummary();
    expect(summary.total).toBe(1);
  });

  test('should run search interface test', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    await framework.executeTestCase(AI_TEST_CASES.interfaceManagement.searchInterface);
    
    const summary = framework.getTestSummary();
    expect(summary.total).toBe(1);
  });

  test('should run ai agent page test', async ({ page }) => {
    const framework = new AIAgentTestFramework(page);
    
    await framework.executeTestCase({
      name: 'Navigate to AI Agent page',
      steps: [
        { action: 'navigate', value: '/login' },
        { action: 'fill', selector: 'input[placeholder="请输入邮箱或用户名"]', value: 'admin@admin.com' },
        { action: 'fill', selector: 'input[placeholder="请输入密码"]', value: '12345678' },
        { action: 'click', selector: 'button:has-text("登录")' },
        { action: 'wait', value: 3000 },
        { action: 'navigate', value: '/ai-agent' },
        { action: 'wait', value: 2000 },
      ],
      assertions: [],
    });
    
    const summary = framework.getTestSummary();
    expect(summary.total).toBe(1);
  });
});

test.describe('Predefined Test Cases', () => {
  test('should have authentication tests', () => {
    expect(AI_TEST_CASES.authentication).toBeTruthy();
    expect(AI_TEST_CASES.authentication.loginWithValidCredentials).toBeTruthy();
  });

  test('should have project management tests', () => {
    expect(AI_TEST_CASES.projectManagement).toBeTruthy();
    expect(AI_TEST_CASES.projectManagement.viewProjectList).toBeTruthy();
  });

  test('should have interface management tests', () => {
    expect(AI_TEST_CASES.interfaceManagement).toBeTruthy();
    expect(AI_TEST_CASES.interfaceManagement.searchInterface).toBeTruthy();
  });

  test('should have ai agent tests', () => {
    expect(AI_TEST_CASES.aiAgent).toBeTruthy();
    expect(AI_TEST_CASES.aiAgent.viewAiAgentPage).toBeTruthy();
  });
});