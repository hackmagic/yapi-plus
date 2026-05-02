/**
 * 快速验证登录状态保持修复
 * 
 * 运行方式: npx playwright test test-login-state.js
 */
const { test, expect } = require('@playwright/test');

test.describe('Login State Persistence Verification', () => {
  
  test('should maintain login state across pages', async ({ page }) => {
    console.log('\n========================================');
    console.log('开始验证登录状态保持修复');
    console.log('========================================\n');
    
    const results = [];
    
    // ========== 步骤 1: 登录 ==========
    console.log('📝 步骤 1: 执行登录...');
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    const afterLoginUrl = page.url();
    const loginRedirectPass = afterLoginUrl === 'http://localhost:4000/';
    results.push({
      test: '登录后重定向到首页',
      expected: 'http://localhost:4000/',
      actual: afterLoginUrl,
      pass: loginRedirectPass
    });
    console.log(`   结果: ${loginRedirectPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   预期: http://localhost:4000/`);
    console.log(`   实际: ${afterLoginUrl}\n`);
    
    // ========== 步骤 2: 访问 AI Agent 页面 ==========
    console.log('📝 步骤 2: 访问 AI Agent 页面 (需要管理员权限)...');
    await page.goto('http://localhost:4000/ai-agent');
    await page.waitForTimeout(2000);
    
    const aiAgentUrl = page.url();
    const aiAgentPass = aiAgentUrl === 'http://localhost:4000/ai-agent';
    results.push({
      test: 'AI Agent 页面访问',
      expected: 'http://localhost:4000/ai-agent',
      actual: aiAgentUrl,
      pass: aiAgentPass
    });
    console.log(`   结果: ${aiAgentPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   预期: http://localhost:4000/ai-agent`);
    console.log(`   实际: ${aiAgentUrl}\n`);
    
    // ========== 步骤 3: 访问系统设置页面 ==========
    console.log('📝 步骤 3: 访问系统设置页面 (需要管理员权限)...');
    await page.goto('http://localhost:4000/system-settings');
    await page.waitForTimeout(2000);
    
    const systemSettingsUrl = page.url();
    const systemSettingsPass = systemSettingsUrl === 'http://localhost:4000/system-settings';
    results.push({
      test: '系统设置页面访问',
      expected: 'http://localhost:4000/system-settings',
      actual: systemSettingsUrl,
      pass: systemSettingsPass
    });
    console.log(`   结果: ${systemSettingsPass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   预期: http://localhost:4000/system-settings`);
    console.log(`   实际: ${systemSettingsUrl}\n`);
    
    // ========== 步骤 4: 访问用户设置页面 ==========
    console.log('📝 步骤 4: 访问用户设置页面 (需要登录)...');
    await page.goto('http://localhost:4000/user/profile');
    await page.waitForTimeout(2000);
    
    const userProfileUrl = page.url();
    const userProfilePass = userProfileUrl === 'http://localhost:4000/user/profile';
    results.push({
      test: '用户设置页面访问',
      expected: 'http://localhost:4000/user/profile',
      actual: userProfileUrl,
      pass: userProfilePass
    });
    console.log(`   结果: ${userProfilePass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   预期: http://localhost:4000/user/profile`);
    console.log(`   实际: ${userProfileUrl}\n`);
    
    // 检查用户名输入框
    const usernameInput = page.locator('input[name="username"]').first();
    const isUsernameVisible = await usernameInput.isVisible().catch(() => false);
    results.push({
      test: '用户名输入框可见',
      expected: true,
      actual: isUsernameVisible,
      pass: isUsernameVisible
    });
    console.log(`   用户名输入框可见: ${isUsernameVisible ? '✅' : '❌'}\n`);
    
    // ========== 步骤 5: 访问接口列表页面 ==========
    console.log('📝 步骤 5: 访问接口列表页面 (需要登录)...');
    await page.goto('http://localhost:4000/project/1/interface');
    await page.waitForTimeout(2000);
    
    const interfaceUrl = page.url();
    const interfacePass = interfaceUrl.includes('project/1/interface');
    results.push({
      test: '接口列表页面访问',
      expected: '包含 project/1/interface',
      actual: interfaceUrl,
      pass: interfacePass
    });
    console.log(`   结果: ${interfacePass ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`   预期: 包含 project/1/interface`);
    console.log(`   实际: ${interfaceUrl}\n`);
    
    // 检查添加接口按钮
    const addBtn = page.locator('button:has-text("添加接口")');
    const isAddBtnVisible = await addBtn.isVisible().catch(() => false);
    results.push({
      test: '添加接口按钮可见',
      expected: true,
      actual: isAddBtnVisible,
      pass: isAddBtnVisible
    });
    console.log(`   添加接口按钮可见: ${isAddBtnVisible ? '✅' : '❌'}\n`);
    
    // ========== 汇总结果 ==========
    console.log('========================================');
    console.log('测试结果汇总');
    console.log('========================================\n');
    
    const totalTests = results.length;
    const passedTests = results.filter(r => r.pass).length;
    const failedTests = totalTests - passedTests;
    
    results.forEach((result, index) => {
      const icon = result.pass ? '✅' : '❌';
      console.log(`${index + 1}. ${icon} ${result.test}`);
      if (!result.pass) {
        console.log(`   预期: ${result.expected}`);
        console.log(`   实际: ${result.actual}`);
      }
    });
    
    console.log('\n----------------------------------------');
    console.log(`总计: ${totalTests} 个测试`);
    console.log(`通过: ${passedTests} 个 ✅`);
    console.log(`失败: ${failedTests} 个 ❌`);
    console.log(`通过率: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('----------------------------------------\n');
    
    // 断言所有测试都通过
    expect(passedTests).toBe(totalTests);
  });
});
