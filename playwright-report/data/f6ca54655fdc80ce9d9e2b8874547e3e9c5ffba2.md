# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ai-agent-tests.test.js >> AI Agent Integration Tests >> should login with valid credentials
- Location: test\e2e\tests\ai-agent-tests.test.js:88:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - alert [ref=e6]:
    - button "close" [ref=e7] [cursor=pointer]:
      - img [ref=e9]
    - img [ref=e15]
    - generic [ref=e20]: YAPI 的接口测试等功能仅支持 Chrome 浏览器，请使用 Chrome 浏览器获得完整功能。
  - generic [ref=e21]:
    - heading "YAPI Plus 登录" [ref=e22]:
      - heading "YAPI Plus 登录" [ref=e23]
    - generic [ref=e24]:
      - generic [ref=e25]:
        - generic [ref=e27]: 用户名/邮箱
        - generic [ref=e30]:
          - img [ref=e32]:
            - img [ref=e33]
          - textbox "请输入邮箱或用户名" [ref=e37]: admin@admin.com
      - generic [ref=e39]:
        - generic [ref=e40]:
          - generic [ref=e41]: 密码
          - generic [ref=e42]: "*"
        - generic [ref=e45]:
          - img [ref=e47]:
            - img [ref=e48]
          - textbox "请输入密码" [ref=e51]: ymfe.org
          - img [ref=e55] [cursor=pointer]
      - generic [ref=e63]:
        - button "登录" [active] [ref=e64] [cursor=pointer]:
          - generic [ref=e65]: 登录
        - button "还没有账号？去注册" [ref=e66] [cursor=pointer]:
          - generic [ref=e67]: 还没有账号？去注册
```

# Test source

```ts
  1   | /**
  2   |  * AI Agent Automated Tests
  3   |  * 使用AI Agent测试框架进行自动化测试
  4   |  */
  5   | const { test, expect } = require('@playwright/test');
  6   | const { 
  7   |   AIAgentTestFramework, 
  8   |   AI_TEST_CASES, 
  9   |   runAITests 
  10  | } = require('../ai-agent-framework');
  11  | 
  12  | test.describe('AI Agent Framework Tests', () => {
  13  |   test('should create framework instance', async ({ page }) => {
  14  |     const framework = new AIAgentTestFramework(page);
  15  |     expect(framework).toBeTruthy();
  16  |     expect(framework.testConfig.baseURL).toBeTruthy();
  17  |   });
  18  | 
  19  |   test('should generate test from natural language', async ({ page }) => {
  20  |     const framework = new AIAgentTestFramework(page);
  21  |     
  22  |     const testCase = framework.generateTestCaseFromNaturalLanguage(
  23  |       '测试用户登录功能，首先打开登录页面，然后输入用户名密码，点击登录按钮，验证是否成功跳转'
  24  |     );
  25  |     
  26  |     expect(testCase.name).toBeTruthy();
  27  |     expect(testCase.steps).toBeTruthy();
  28  |     expect(testCase.assertions).toBeTruthy();
  29  |   });
  30  | 
  31  |   test('should export json report', async ({ page }) => {
  32  |     const framework = new AIAgentTestFramework(page);
  33  |     
  34  |     await framework.executeTestCase({
  35  |       name: 'Test',
  36  |       steps: [{ action: 'navigate', value: '/login' }],
  37  |       assertions: [],
  38  |     });
  39  |     
  40  |     const jsonReport = framework.exportReport('json');
  41  |     expect(jsonReport).toBeTruthy();
  42  |     expect(jsonReport).toContain('passed');
  43  |   });
  44  | 
  45  |   test('should export html report', async ({ page }) => {
  46  |     const framework = new AIAgentTestFramework(page);
  47  |     
  48  |     await framework.executeTestCase({
  49  |       name: 'Test',
  50  |       steps: [{ action: 'navigate', value: '/login' }],
  51  |       assertions: [],
  52  |     });
  53  |     
  54  |     const htmlReport = framework.exportReport('html');
  55  |     expect(htmlReport).toContain('AI Agent Test Report');
  56  |   });
  57  | });
  58  | 
  59  | test.describe('AI Agent Navigation Tests', () => {
  60  |   test('should login via framework', async ({ page }) => {
  61  |     const framework = new AIAgentTestFramework(page);
  62  |     
  63  |     await framework.executeTestCase({
  64  |       name: 'Login test',
  65  |       steps: [
  66  |         { action: 'login', value: { email: 'admin@admin.com', password: 'ymfe.org' } },
  67  |         { action: 'wait', value: 3000 },
  68  |       ],
  69  |       assertions: [
  70  |         { type: 'urlContains', expected: 'login', invert: true },
  71  |       ],
  72  |     });
  73  |     
  74  |     const summary = framework.getTestSummary();
  75  |     expect(summary.passed).toBe(1);
  76  |   });
  77  | 
  78  |   test('should navigate to project list after login', async ({ page }) => {
  79  |     const framework = new AIAgentTestFramework(page);
  80  |     await framework.executeTestCase(AI_TEST_CASES.projectManagement.viewProjectList);
  81  |     
  82  |     const summary = framework.getTestSummary();
  83  |     expect(summary.total).toBe(1);
  84  |   });
  85  | });
  86  | 
  87  | test.describe('AI Agent Integration Tests', () => {
  88  |   test('should login with valid credentials', async ({ page }) => {
  89  |     const framework = new AIAgentTestFramework(page);
  90  |     await framework.executeTestCase(AI_TEST_CASES.authentication.loginWithValidCredentials);
  91  |     
  92  |     const summary = framework.getTestSummary();
> 93  |     expect(summary.passed).toBe(1);
      |                            ^ Error: expect(received).toBe(expected) // Object.is equality
  94  |   });
  95  | 
  96  |   test('should create project after login', async ({ page }) => {
  97  |     const framework = new AIAgentTestFramework(page);
  98  |     await framework.executeTestCase(AI_TEST_CASES.projectManagement.createProject);
  99  |     
  100 |     const summary = framework.getTestSummary();
  101 |     expect(summary.total).toBe(1);
  102 |   });
  103 | 
  104 |   test('should search interfaces after login', async ({ page }) => {
  105 |     const framework = new AIAgentTestFramework(page);
  106 |     await framework.executeTestCase(AI_TEST_CASES.interfaceManagement.searchInterface);
  107 |     
  108 |     const summary = framework.getTestSummary();
  109 |     expect(summary.total).toBe(1);
  110 |   });
  111 | 
  112 |   test('should navigate to AI agent page after login', async ({ page }) => {
  113 |     const framework = new AIAgentTestFramework(page);
  114 |     await framework.executeTestCase(AI_TEST_CASES.aiAgent.viewAiAgentPage);
  115 |     
  116 |     const summary = framework.getTestSummary();
  117 |     expect(summary.total).toBe(1);
  118 |   });
  119 | });
  120 | 
  121 | test.describe('Predefined Test Cases', () => {
  122 |   test('should have authentication tests', () => {
  123 |     expect(AI_TEST_CASES.authentication).toBeTruthy();
  124 |     expect(AI_TEST_CASES.authentication.loginWithValidCredentials).toBeTruthy();
  125 |   });
  126 | 
  127 |   test('should have project management tests', () => {
  128 |     expect(AI_TEST_CASES.projectManagement).toBeTruthy();
  129 |     expect(AI_TEST_CASES.projectManagement.viewProjectList).toBeTruthy();
  130 |   });
  131 | 
  132 |   test('should have interface management tests', () => {
  133 |     expect(AI_TEST_CASES.interfaceManagement).toBeTruthy();
  134 |     expect(AI_TEST_CASES.interfaceManagement.searchInterface).toBeTruthy();
  135 |   });
  136 | 
  137 |   test('should have ai agent tests', () => {
  138 |     expect(AI_TEST_CASES.aiAgent).toBeTruthy();
  139 |     expect(AI_TEST_CASES.aiAgent.viewAiAgentPage).toBeTruthy();
  140 |   });
  141 | });
```