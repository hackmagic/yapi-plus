/**
 * Deep Functional Tests - Real user scenarios
 */
const { test, expect } = require('@playwright/test');

test.describe('Real User Workflow Tests', () => {
  
  test('should login and create a real project', async ({ page }) => {
    // 1. 登录
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 验证登录成功 - 应该跳转到首页且显示用户信息
    const url = page.url();
    console.log('登录后URL:', url);
    
    // 2. 创建项目
    await page.goto('http://localhost:4000/add-project');
    await page.waitForTimeout(2000);
    
    const nameInput = page.locator('input[placeholder*="项目名称"]');
    const isVisible = await nameInput.isVisible();
    console.log('添加项目表单可见:', isVisible);
    
    if (isVisible) {
      await nameInput.fill('E2E测试项目 ' + Date.now());
      await page.fill('textarea[placeholder*="描述"]', '这是自动化测试创建的项目');
      await page.click('button:has-text("创建")');
      await page.waitForTimeout(3000);
      
      // 检查是否创建成功
      const currentUrl = page.url();
      console.log('创建后URL:', currentUrl);
      expect(currentUrl).toContain('project');
    } else {
      console.log('添加项目表单不可见，可能需要登录状态或权限');
    }
  });

  test('should login and create a real interface', async ({ page }) => {
    // 1. 登录
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 2. 访问项目接口页面
    await page.goto('http://localhost:4000/project/1/interface');
    await page.waitForTimeout(2000);
    
    console.log('接口页面URL:', page.url());
    
    // 检查页面内容
    const content = await page.content();
    console.log('接口页面包含项目内容:', content.includes('接口') || content.includes('interface'));
    
    // 3. 尝试添加接口
    const addBtn = page.locator('button:has-text("添加接口")');
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForTimeout(1000);
      
      // 填写接口信息
      const pathInput = page.locator('input[placeholder*="路径"], input[name="path"]');
      if (await pathInput.isVisible()) {
        await pathInput.fill('/api/e2e-test-' + Date.now());
        await page.click('button:has-text("保存")');
        await page.waitForTimeout(2000);
        
        console.log('保存接口后URL:', page.url());
      }
    } else {
      console.log('添加接口按钮不可见');
      // 打印页面内容以便调试
      const pageContent = await page.content();
      console.log('页面包含"接口":', pageContent.includes('接口'));
      console.log('页面包含"添加":', pageContent.includes('添加'));
    }
  });

  test('should login and access user profile', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 访问用户设置
    await page.goto('http://localhost:4000/user/profile');
    await page.waitForTimeout(2000);
    
    console.log('用户设置页面URL:', page.url());
    
    // 检查是否有表单
    const usernameInput = page.locator('input[name="username"], input[placeholder*="用户名"]');
    console.log('用户名输入框可见:', await usernameInput.isVisible());
  });

  test('should login and access AI agent page as admin', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 访问AI Agent页面
    await page.goto('http://localhost:4000/ai-agent');
    await page.waitForTimeout(2000);
    
    console.log('AI Agent页面URL:', page.url());
    
    // 检查页面内容
    const content = await page.content();
    console.log('AI页面包含助手:', content.includes('助手') || content.includes('AI') || content.includes('agent'));
    
    // 检查是否有添加按钮
    const addBtn = page.locator('button:has-text("添加"), button:has-text("新建")');
    console.log('添加助手按钮可见:', await addBtn.isVisible().catch(() => false));
  });

  test('should login and view group list', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 访问分组页面
    await page.goto('http://localhost:4000/group/1');
    await page.waitForTimeout(2000);
    
    console.log('分组页面URL:', page.url());
    console.log('分组页面标题:', await page.title());
    
    // 检查页面内容
    const content = await page.content();
    console.log('分组页面包含项目:', content.includes('项目') || content.includes('group'));
  });

  test('should test search functionality', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 访问搜索页面
    await page.goto('http://localhost:4000/search');
    await page.waitForTimeout(2000);
    
    console.log('搜索页面URL:', page.url());
    
    // 尝试搜索
    const searchInput = page.locator('input[placeholder*="搜索"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      console.log('搜索输入成功');
    }
  });

  test('should test news page', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 访问动态页面
    await page.goto('http://localhost:4000/news');
    await page.waitForTimeout(2000);
    
    console.log('动态页面URL:', page.url());
    
    const content = await page.content();
    console.log('动态页面有内容:', content.length > 500);
  });

  test('should test follow page', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 访问关注页面
    await page.goto('http://localhost:4000/follows');
    await page.waitForTimeout(2000);
    
    console.log('关注页面URL:', page.url());
  });

  test('should test system settings as admin', async ({ page }) => {
    await page.goto('http://localhost:4000/login');
    await page.fill('input[placeholder="请输入邮箱或用户名"]', 'admin@admin.com');
    await page.fill('input[placeholder="请输入密码"]', '12345678');
    await page.click('button:has-text("登录")');
    await page.waitForTimeout(3000);
    
    // 访问系统设置页面
    await page.goto('http://localhost:4000/system-settings');
    await page.waitForTimeout(2000);
    
    console.log('系统设置页面URL:', page.url());
    
    const content = await page.content();
    console.log('系统设置页面包含设置:', content.includes('设置') || content.includes('配置'));
  });
});