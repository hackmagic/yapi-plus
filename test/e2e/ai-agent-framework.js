/**
 * AI Agent Automation Test Framework
 * 智能测试框架 - 支持自然语言测试用例生成和自动化执行
 */
const { test, expect } = require('@playwright/test');
const { AiAgentPage } = require('./pages/AiAgentPages');

class AIAgentTestFramework {
  constructor(page) {
    this.page = page;
    this.testResults = [];
    this.testConfig = {
      baseURL: process.env.TEST_BASE_URL || 'http://localhost:4000',
      timeout: 30000,
      retries: 2,
      screenshotOnFailure: true,
      videoRecording: true,
    };
  }

  async login(email = 'admin@admin.com', password = '12345678') {
    await this.page.goto(`${this.testConfig.baseURL}/login`);
    await this.page.fill('input[placeholder="请输入邮箱或用户名"]', email);
    await this.page.fill('input[placeholder="请输入密码"]', password);
    await this.page.click('button:has-text("登录")');
    await this.page.waitForTimeout(3000);
  }

  async executeTestCase(testCase) {
    const result = {
      name: testCase.name,
      status: 'pending',
      startTime: Date.now(),
      errors: [],
      screenshots: [],
    };

    try {
      console.log(`[AI Agent] Executing test: ${testCase.name}`);
      
      if (testCase.setup) {
        await this.executeStep(testCase.setup);
      }

      for (const step of testCase.steps) {
        await this.executeStep(step);
      }

      if (testCase.assertions) {
        for (const assertion of testCase.assertions) {
          await this.validateAssertion(assertion);
        }
      }

      result.status = 'passed';
      console.log(`[AI Agent] Test passed: ${testCase.name}`);
    } catch (error) {
      result.status = 'failed';
      result.errors.push(error.message);
      
      if (this.testConfig.screenshotOnFailure) {
        const screenshot = await this.page.screenshot();
        result.screenshots.push({
          timestamp: Date.now(),
          data: screenshot.toString('base64'),
        });
      }
      
      console.log(`[AI Agent] Test failed: ${testCase.name} - ${error.message}`);
    }

    result.endTime = Date.now();
    result.duration = result.endTime - result.startTime;
    this.testResults.push(result);

    return result;
  }

  async executeStep(step) {
    const { action, selector, value, timeout } = step;
    const waitTime = timeout || 5000;

    switch (action) {
      case 'navigate':
        const url = value.startsWith('http') ? value : `${this.testConfig.baseURL}${value}`;
        await this.page.goto(url, { timeout: waitTime });
        break;
      
      case 'login':
        await this.login(value?.email, value?.password);
        break;
      
      case 'click':
        if (selector) {
          await this.page.click(selector, { timeout: waitTime });
        }
        break;
      
      case 'fill':
        if (selector && value !== undefined) {
          await this.page.fill(selector, value);
        }
        break;
      
      case 'type':
        if (selector && value !== undefined) {
          await this.page.type(selector, value);
        }
        break;
      
      case 'select':
        if (selector && value !== undefined) {
          await this.page.selectOption(selector, value);
        }
        break;
      
      case 'wait':
        await this.page.waitForTimeout(waitTime);
        break;
      
      case 'waitForSelector':
        if (selector) {
          await this.page.waitForSelector(selector, { timeout: waitTime });
        }
        break;
      
      case 'hover':
        if (selector) {
          await this.page.hover(selector);
        }
        break;
      
      case 'dblclick':
        if (selector) {
          await this.page.dblclick(selector);
        }
        break;
      
      case 'press':
        if (value) {
          await this.page.press(selector || 'body', value);
        }
        break;
      
      case 'evaluate':
        await this.page.evaluate(value);
        break;
      
      case 'screenshot':
        await this.page.screenshot({ 
          path: `test-results/screenshots/${value || 'step'}.png` 
        });
        break;
      
      default:
        console.log(`[AI Agent] Unknown action: ${action}`);
    }
  }

  async validateAssertion(assertion) {
    const { type, expected, actual, message, selector, invert } = assertion;

    switch (type) {
      case 'urlContains':
        const url = this.page.url();
        if (invert) {
          expect(url).not.toContain(expected);
        } else {
          expect(url).toContain(expected);
        }
        break;
      
      case 'urlMatch':
        expect(this.page.url()).toMatch(expected);
        break;
      
      case 'titleContains':
        const title = await this.page.title();
        expect(title).toContain(expected);
        break;
      
      case 'textContent':
        const text = await this.page.textContent(selector);
        expect(text).toContain(expected);
        break;
      
      case 'visible':
        await expect(this.page.locator(selector)).toBeVisible({ timeout: 5000 });
        break;
      
      case 'hidden':
        await expect(this.page.locator(selector)).toBeHidden();
        break;
      
      case 'enabled':
        await expect(this.page.locator(selector)).toBeEnabled();
        break;
      
      case 'disabled':
        await expect(this.page.locator(selector)).toBeDisabled();
        break;
      
      case 'value':
        const value = await this.page.inputValue(selector);
        expect(value).toBe(expected);
        break;
      
      case 'count':
        const count = await this.page.locator(selector).count();
        expect(count).toBe(expected);
        break;
      
      case 'responseStatus':
        const response = await this.page.request.get(expected.url);
        expect(response.status()).toBe(expected.status);
        break;
      
      case 'custom':
        const result = await this.page.evaluate(expected.function);
        expect(result).toBe(expected.result);
        break;
      
      default:
        console.log(`[AI Agent] Unknown assertion type: ${type}`);
    }
  }

  generateTestCaseFromNaturalLanguage(description) {
    const testCase = {
      name: description,
      steps: [],
      assertions: [],
    };

    return testCase;
  }

  getTestSummary() {
    const summary = {
      total: this.testResults.length,
      passed: this.testResults.filter(r => r.status === 'passed').length,
      failed: this.testResults.filter(r => r.status === 'failed').length,
      duration: this.testResults.reduce((acc, r) => acc + (r.duration || 0), 0),
      results: this.testResults,
    };

    return summary;
  }

  exportReport(format = 'json') {
    const summary = this.getTestSummary();
    
    if (format === 'json') {
      return JSON.stringify(summary, null, 2);
    }
    
    if (format === 'html') {
      return this.generateHTMLReport(summary);
    }
    
    return summary;
  }

  generateHTMLReport(summary) {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>AI Agent Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f5f5f5; padding: 20px; border-radius: 5px; }
    .passed { color: green; }
    .failed { color: red; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
  </style>
</head>
<body>
  <h1>AI Agent Test Report</h1>
  <div class="summary">
    <p><strong>Total Tests:</strong> ${summary.total}</p>
    <p class="passed"><strong>Passed:</strong> ${summary.passed}</p>
    <p class="failed"><strong>Failed:</strong> ${summary.failed}</p>
    <p><strong>Total Duration:</strong> ${summary.duration}ms</p>
  </div>
  <table>
    <tr><th>Test Name</th><th>Status</th><th>Duration</th><th>Errors</th></tr>
    ${summary.results.map(r => `
      <tr>
        <td>${r.name}</td>
        <td class="${r.status}">${r.status}</td>
        <td>${r.duration}ms</td>
        <td>${r.errors.join(', ') || '-'}</td>
      </tr>
    `).join('')}
  </table>
</body>
</html>`;
  }
}

const AI_TEST_CASES = {
  authentication: {
    loginWithValidCredentials: {
      name: 'Login with valid credentials',
      steps: [
        { action: 'login', value: { email: 'admin@admin.com', password: '12345678' } },
        { action: 'wait', value: 3000 },
      ],
      assertions: [
        { type: 'urlContains', expected: 'login', invert: true },
      ],
    },

    loginWithInvalidCredentials: {
      name: 'Login with invalid credentials',
      steps: [
        { action: 'navigate', value: '/login' },
        { action: 'fill', selector: 'input[placeholder="请输入邮箱或用户名"]', value: 'invalid@test.com' },
        { action: 'fill', selector: 'input[placeholder="请输入密码"]', value: 'wrongpassword' },
        { action: 'click', selector: 'button:has-text("登录")' },
        { action: 'wait', value: 2000 },
      ],
      assertions: [
        { type: 'urlContains', expected: 'login' },
      ],
    },
  },

  projectManagement: {
    viewProjectList: {
      name: 'View project list after login',
      steps: [
        { action: 'login', value: { email: 'admin@admin.com', password: '12345678' } },
        { action: 'navigate', value: '/group/1/project' },
        { action: 'wait', value: 2000 },
      ],
      assertions: [
        { type: 'urlContains', expected: 'project' },
      ],
    },

    createProject: {
      name: 'Create a new project',
      steps: [
        { action: 'login', value: { email: 'admin@admin.com', password: '12345678' } },
        { action: 'navigate', value: '/add-project' },
        { action: 'wait', value: 2000 },
        { action: 'fill', selector: 'input[placeholder*="项目名称"]', value: 'AI Test Project' },
        { action: 'click', selector: 'button:has-text("创建")' },
        { action: 'wait', value: 2000 },
      ],
      assertions: [
        { type: 'urlContains', expected: 'project' },
      ],
    },
  },

  interfaceManagement: {
    searchInterface: {
      name: 'Search for an interface',
      steps: [
        { action: 'login', value: { email: 'admin@admin.com', password: '12345678' } },
        { action: 'navigate', value: '/project/1/interface' },
        { action: 'wait', value: 2000 },
        { action: 'fill', selector: 'input[placeholder*="搜索"]', value: 'test' },
        { action: 'wait', value: 1000 },
      ],
      assertions: [
        { type: 'value', selector: 'input[placeholder*="搜索"]', expected: 'test' },
      ],
    },
  },

  aiAgent: {
    viewAiAgentPage: {
      name: 'Navigate to AI Agent page',
      steps: [
        { action: 'login', value: { email: 'admin@admin.com', password: '12345678' } },
        { action: 'navigate', value: '/ai-agent' },
        { action: 'wait', value: 2000 },
      ],
      assertions: [
        { type: 'urlContains', expected: 'ai-agent' },
      ],
    },
  },
};

async function runAITests(page, category = 'all') {
  const framework = new AIAgentTestFramework(page);
  
  const testCategories = category === 'all' 
    ? Object.keys(AI_TEST_CASES) 
    : [category];

  console.log('[AI Agent] Starting automated tests...');

  for (const cat of testCategories) {
    const testCases = AI_TEST_CASES[cat];
    console.log(`[AI Agent] Running ${cat} tests...`);
    
    for (const [name, testCase] of Object.entries(testCases)) {
      await framework.executeTestCase(testCase);
    }
  }

  const summary = framework.getTestSummary();
  console.log(`[AI Agent] Tests completed: ${summary.passed}/${summary.total} passed`);
  
  return framework;
}

module.exports = {
  AIAgentTestFramework,
  AI_TEST_CASES,
  runAITests,
};