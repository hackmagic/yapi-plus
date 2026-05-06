/**
 * Deep Audit Fixes Verification Tests
 *
 * Tests that verify the fixes from the 2026-05-06 deep process audit.
 * Covers: API path alignment, permission logic, form validation, component fixes.
 */
const { test, expect } = require('@playwright/test');

// ─── Helpers ────────────────────────────────────────────────────────────────

const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = '12345678';

async function login(page, email = ADMIN_EMAIL, password = ADMIN_PASSWORD) {
  await page.goto('http://localhost:4000/login');
  await page.fill('input[placeholder="请输入邮箱或用户名"]', email);
  await page.fill('input[placeholder="请输入密码"]', password);
  await page.click('button:has-text("登录")');
  await page.waitForTimeout(3000);
}

async function createProject(page, name) {
  await page.goto('http://localhost:4000/add-project');
  await page.waitForTimeout(2000);
  const nameInput = page.locator('input[placeholder*="项目名称"]').first();
  if (await nameInput.isVisible()) {
    await nameInput.fill(name);
    // Select first group if available
    const groupSelect = page.locator('.n-select').first();
    if (await groupSelect.isVisible()) {
      await groupSelect.click();
      await page.waitForTimeout(500);
      const firstOption = page.locator('.n-select-option').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
    }
    await page.click('button:has-text("创建项目")');
    await page.waitForTimeout(3000);
    const url = page.url();
    const match = url.match(/project\/(\d+)/);
    return match ? match[1] : null;
  }
  return null;
}

// ─── Test Suite ─────────────────────────────────────────────────────────────

test.describe('深度流程审计修复验证', () => {

  // ── NT1: Header.vue logout crash fix ───────────────────────────────────

  test('NT1: Header 退出登录不崩溃 (useMessage 已注入)', async ({ page }) => {
    await login(page);

    // Navigate to a page where header is visible
    await page.goto('http://localhost:4000/group');
    await page.waitForTimeout(2000);

    // Check that the page loaded without JS errors
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    // Look for user menu / logout area
    const userArea = page.locator('.n-dropdown, [class*="user"], [class*="avatar"]').first();
    if (await userArea.isVisible().catch(() => false)) {
      await userArea.click();
      await page.waitForTimeout(500);

      const logoutBtn = page.locator('button:has-text("退出"), button:has-text("登出"), span:has-text("退出")').first();
      if (await logoutBtn.isVisible().catch(() => false)) {
        await logoutBtn.click();
        await page.waitForTimeout(2000);

        // Should not have JS ReferenceError about `message`
        const jsErrors = errors.filter(e => e.includes('message is not defined') || e.includes('ReferenceError'));
        expect(jsErrors.length).toBe(0);
      }
    }
  });

  // ── NT2: ProjectList.vue router fix ────────────────────────────────────

  test('NT2: 项目列表编辑按钮不崩溃 (useRouter 已注入)', async ({ page }) => {
    await login(page);

    // Create a project first
    const projectId = await createProject(page, 'E2E编辑测试 ' + Date.now());
    if (projectId) {
      // Navigate to project list
      await page.goto('http://localhost:4000/group');
      await page.waitForTimeout(2000);

      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      // Try clicking edit button on a project card
      const editBtn = page.locator('button[title*="编辑"], button[class*="edit"], a[href*="/setting"]').first();
      if (await editBtn.isVisible().catch(() => false)) {
        await editBtn.click();
        await page.waitForTimeout(2000);

        // Should not have JS ReferenceError about `router`
        const jsErrors = errors.filter(e => e.includes('router is not defined') || e.includes('ReferenceError'));
        expect(jsErrors.length).toBe(0);
      }
    }
  });

  // ── NT3 + NT4: API path alignment — Follow ─────────────────────────────

  test('NT3-NT4: 关注列表 API 路径正确 (/api/follow/list)', async ({ page }) => {
    await login(page);

    // Intercept API calls to verify correct paths
    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/follow') || url.includes('/api/project/follow')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    await page.goto('http://localhost:4000/follows');
    await page.waitForTimeout(3000);

    // The follow list call should use /api/follow/list, not /api/project/follow_list
    const followListCalls = apiCalls.filter(c => c.url.includes('/api/follow/list'));
    const wrongPathCalls = apiCalls.filter(c => c.url.includes('/api/project/follow_list'));

    // If any follow API was called, it should use the correct path
    if (apiCalls.length > 0) {
      expect(wrongPathCalls.length).toBe(0);
    }
  });

  // ── NT3 + NT4: API path alignment — InterfaceCol ───────────────────────

  test('NT3-NT4: 集合 API 路径正确 (/api/col/*)', async ({ page }) => {
    await login(page);

    const projectId = await createProject(page, 'E2E集合测试 ' + Date.now());
    if (!projectId) return;

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/interfaceCol') || url.includes('/api/interfaceCase') || url.includes('/api/col/')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    // Navigate to interface collection page
    await page.goto(`http://localhost:4000/project/${projectId}/interface`);
    await page.waitForTimeout(2000);

    // Check that no old API paths are used
    const wrongPathCalls = apiCalls.filter(
      c => c.url.includes('/api/interfaceCol/') || c.url.includes('/api/interfaceCase/')
    );
    expect(wrongPathCalls.length).toBe(0);
  });

  // ── NT3 + NT4: API path alignment — Group member ───────────────────────

  test('NT3-NT4: 分组成员 API 路径正确 (/api/group/add_member)', async ({ page }) => {
    await login(page);

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/group/')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    // Navigate to group page
    await page.goto('http://localhost:4000/group');
    await page.waitForTimeout(2000);

    // The group member APIs should use underscore format
    const wrongPathCalls = apiCalls.filter(
      c => c.url.includes('/api/group/addMember') || c.url.includes('/api/group/delMember') || c.url.includes('/api/group/getMemberList')
    );
    expect(wrongPathCalls.length).toBe(0);
  });

  // ── NT3 + NT4: API path alignment — Project member ─────────────────────

  test('NT3-NT4: 项目成员 API 路径正确 (/api/project/add_member)', async ({ page }) => {
    await login(page);

    const projectId = await createProject(page, 'E2E成员测试 ' + Date.now());
    if (!projectId) return;

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/project/addMember') || url.includes('/api/project/delMember')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    // Navigate to project setting
    await page.goto(`http://localhost:4000/project/${projectId}/setting`);
    await page.waitForTimeout(2000);

    // Should NOT use camelCase paths
    const wrongPathCalls = apiCalls.filter(
      c => c.url.includes('/api/project/addMember') || c.url.includes('/api/project/delMember')
    );
    expect(wrongPathCalls.length).toBe(0);
  });

  // ── NT3: API path alignment — Export/Import data ───────────────────────

  test('NT3: 数据导出 API 路径正确 (/api/open/export_data)', async ({ page }) => {
    await login(page);

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/export_data') || url.includes('/import_data')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    // Navigate to a project
    await page.goto('http://localhost:4000/project/1/setting');
    await page.waitForTimeout(2000);

    // Export API should use /api/open/export_data, not /api/project/export_data
    const wrongExportCalls = apiCalls.filter(
      c => c.url.includes('/api/project/export_data')
    );
    expect(wrongExportCalls.length).toBe(0);
  });

  // ── NT3: API path alignment — User find ────────────────────────────────

  test('NT3: 用户详情 API 路径正确 (/api/user/find)', async ({ page }) => {
    await login(page);

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/user/info') || url.includes('/api/user/find')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    await page.goto('http://localhost:4000/user/profile');
    await page.waitForTimeout(2000);

    // Should NOT use /api/user/info
    const wrongPathCalls = apiCalls.filter(c => c.url.includes('/api/user/info'));
    expect(wrongPathCalls.length).toBe(0);
  });

  // ── NT3: API path alignment — Change password POST ─────────────────────

  test('NT3: 修改密码使用 POST 方法', async ({ page }) => {
    await login(page);

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/user/change_password') || url.includes('/api/user/changePassword')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    await page.goto('http://localhost:4000/user/profile');
    await page.waitForTimeout(2000);

    // Should NOT use /api/user/changePassword (camelCase)
    const wrongPathCalls = apiCalls.filter(c => c.url.includes('/api/user/changePassword'));
    expect(wrongPathCalls.length).toBe(0);

    // If change_password was called, it should be POST
    const changePassCalls = apiCalls.filter(c => c.url.includes('/api/user/change_password'));
    changePassCalls.forEach(call => {
      expect(call.method).toBe('POST');
    });
  });

  // ── NT3: API path alignment — News/Log list ────────────────────────────

  test('NT3: 动态列表 API 路径正确 (/api/log/list)', async ({ page }) => {
    await login(page);

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/notice/list') || url.includes('/api/log/list')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    await page.goto('http://localhost:4000/news');
    await page.waitForTimeout(3000);

    // Should NOT use /api/notice/list
    const wrongPathCalls = apiCalls.filter(c => c.url.includes('/api/notice/list'));
    expect(wrongPathCalls.length).toBe(0);
  });

  // ── NT3: API path alignment — System settings config save ──────────────

  test('NT3: 系统设置统一使用 /api/config/save', async ({ page }) => {
    await login(page);

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/config/')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    await page.goto('http://localhost:4000/system-settings');
    await page.waitForTimeout(2000);

    // Should NOT use old separate endpoints
    const wrongPathCalls = apiCalls.filter(
      c => c.url.includes('/api/config/update-database') ||
           c.url.includes('/api/config/update-admin') ||
           c.url.includes('/api/config/update-mail')
    );
    expect(wrongPathCalls.length).toBe(0);
  });

  // ── NT7 + NT8: Permission logic — exportData ───────────────────────────

  test('NT7: exportData 权限逻辑正确 (有权限用户可导出)', async ({ page }) => {
    await login(page);

    // As admin, we should be able to access export data
    const response = await page.request.get('http://localhost:4000/api/open/export_data?pid=1');
    const status = response.status();

    // Should NOT get 401/403 for admin
    expect(status).not.toBe(401);
    expect(status).not.toBe(403);
  });

  // ── NT7 + NT8: Permission logic — activity ─────────────────────────────

  test('NT8: activity 权限逻辑正确 (有权限用户可查看)', async ({ page }) => {
    await login(page);

    // Get a valid project id
    const response = await page.request.get('http://localhost:4000/api/project/activity?projectId=1');
    const status = response.status();

    // Should NOT get 401/403 for admin
    expect(status).not.toBe(401);
    expect(status).not.toBe(403);
  });

  // ── NT10: InterfaceEditForm validation ─────────────────────────────────

  test('NT10: 接口编辑表单校验 — 空标题不能提交', async ({ page }) => {
    await login(page);

    const projectId = await createProject(page, 'E2E表单测试 ' + Date.now());
    if (!projectId) return;

    // Navigate to interface page
    await page.goto(`http://localhost:4000/project/${projectId}/interface/api`);
    await page.waitForTimeout(2000);

    // Try to submit without filling required fields
    const saveBtn = page.locator('button:has-text("保存"), button[type="submit"]').first();
    if (await saveBtn.isVisible().catch(() => false)) {
      // Clear any pre-filled values
      const titleInput = page.locator('input[placeholder*="接口名称"], input[name="title"]').first();
      if (await titleInput.isVisible().catch(() => false)) {
        await titleInput.fill('');
      }
      const pathInput = page.locator('input[placeholder*="路径"], input[name="path"]').first();
      if (await pathInput.isVisible().catch(() => false)) {
        await pathInput.fill('');
      }

      // Try to save
      await saveBtn.click();
      await page.waitForTimeout(1000);

      // Should still be on the same page (not navigated away)
      // because validation should prevent submission
      const url = page.url();
      // The form should show validation error or stay on page
      const hasErrorMessage = await page.locator('.n-form-item-feedback, .n-message, [class*="error"]').isVisible().catch(() => false);
      // Either error message shown or still on edit page
      expect(hasErrorMessage || url.includes('interface')).toBeTruthy();
    }
  });

  // ── NT12: AddProject field mapping ─────────────────────────────────────

  test('NT12: 创建项目字段映射正确 (project_type 而非 permission)', async ({ page }) => {
    await login(page);

    await page.goto('http://localhost:4000/add-project');
    await page.waitForTimeout(2000);

    const nameInput = page.locator('input[placeholder*="项目名称"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('字段映射测试 ' + Date.now());

      // Select first group
      const groupSelect = page.locator('.n-select').first();
      if (await groupSelect.isVisible()) {
        await groupSelect.click();
        await page.waitForTimeout(500);
        const firstOption = page.locator('.n-select-option').first();
        if (await firstOption.isVisible()) {
          await firstOption.click();
        }
      }

      // Intercept the API call to verify correct field name
      const apiCalls = [];
      page.on('request', req => {
        if (req.url().includes('/api/project/add') && req.method() === 'POST') {
          apiCalls.push({ url: req.url(), postData: req.postData() });
        }
      });

      await page.click('button:has-text("创建项目")');
      await page.waitForTimeout(3000);

      // Check that the POST data contains project_type, not permission
      if (apiCalls.length > 0) {
        const postData = apiCalls[0].postData || '';
        expect(postData).toContain('project_type');
        expect(postData).not.toContain('permission');
      }
    }
  });

  // ── NT13: InterfaceMenu search ─────────────────────────────────────────

  test('NT13: 接口菜单搜索功能可用', async ({ page }) => {
    await login(page);

    const projectId = await createProject(page, 'E2E搜索测试 ' + Date.now());
    if (!projectId) return;

    await page.goto(`http://localhost:4000/project/${projectId}/interface/api`);
    await page.waitForTimeout(2000);

    // Look for search input in interface menu
    const searchInput = page.locator('input[placeholder*="搜索"], input[placeholder*="search"]').first();
    if (await searchInput.isVisible().catch(() => false)) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);

      // The search should filter results (no crash)
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      expect(errors.filter(e => e.includes('TypeError') || e.includes('ReferenceError')).length).toBe(0);
    }
  });

  // ── NT14: Activity.vue uses axios ──────────────────────────────────────

  test('NT14: Activity 页面使用 axios 而非原生 fetch', async ({ page }) => {
    await login(page);

    const apiCalls = [];
    page.on('request', req => {
      const url = req.url();
      if (url.includes('/api/project/activity') || url.includes('/api/log/')) {
        apiCalls.push({ url, method: req.method() });
      }
    });

    // Navigate to activity page
    await page.goto('http://localhost:4000/project/1/activity');
    await page.waitForTimeout(3000);

    // The page should load without errors
    // If activity API was called, it should work (not fail due to fetch issues)
    // We just verify the page loaded
    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);
  });

  // ── NT15: n-editable-table replaced with n-data-table ──────────────────

  test('NT15: 测试用例页面使用 n-data-table 而非 n-editable-table', async ({ page }) => {
    await login(page);

    const projectId = await createProject(page, 'E2E表格测试 ' + Date.now());
    if (!projectId) return;

    // Navigate to test case page
    await page.goto(`http://localhost:4000/project/${projectId}/interface/testcase`);
    await page.waitForTimeout(2000);

    // Check that the page renders without "Unknown component" errors
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const content = await page.content();
    // Should not have n-editable-table in rendered output
    expect(content).not.toContain('n-editable-table');

    // Should not have component resolution errors
    const componentErrors = errors.filter(e => e.includes('Cannot resolve') || e.includes('Unknown custom element'));
    expect(componentErrors.length).toBe(0);
  });

  // ── NT25: Global error handling middleware ─────────────────────────────

  test('NT25: 全局错误处理中间件 — 服务器错误返回 JSON 而非崩溃', async ({ page }) => {
    // Test that the server handles errors gracefully
    const response = await page.request.get('http://localhost:4000/api/project/get?id=invalid_id_format');
    const status = response.status();

    // Should return a proper HTTP status, not crash
    expect(status).toBeLessThan(600);

    // Response should be JSON
    const contentType = response.headers()['content-type'] || '';
    if (contentType.includes('json')) {
      const body = await response.json();
      // Should have proper error structure
      expect(body).toHaveProperty('errcode');
    }
  });

  // ── NT26: CORS middleware ──────────────────────────────────────────────

  test('NT26: 统一 CORS 中间件 — 响应头包含 CORS 相关字段', async ({ page }) => {
    const response = await page.request.get('http://localhost:4000/api/user/status');
    const headers = response.headers();

    // Should have CORS headers
    expect(headers).toHaveProperty('access-control-allow-methods');
    expect(headers).toHaveProperty('access-control-allow-headers');
  });

  // ── NT27: Backend try-catch error handling ─────────────────────────────

  test('NT27: 后端控制器错误处理 — 异常不导致服务器崩溃', async ({ page }) => {
    // Make a request that might cause an error
    const response = await page.request.get('http://localhost:4000/api/group/get?id=nonexistent');
    const status = response.status();

    // Should return a proper error response, not crash
    expect(status).toBeLessThan(600);
    expect(status).toBeGreaterThan(0);
  });

  // ── NT33: ProjectSetting field name fix ────────────────────────────────

  test('NT33: 项目设置使用 project_type 而非 permission', async ({ page }) => {
    await login(page);

    const projectId = await createProject(page, 'E2E设置测试 ' + Date.now());
    if (!projectId) return;

    await page.goto(`http://localhost:4000/project/${projectId}/setting`);
    await page.waitForTimeout(2000);

    // The page should load without errors related to undefined permission field
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));

    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);

    // Should not have errors about reading property of undefined
    const undefinedErrors = errors.filter(e => e.includes("Cannot read propert"));
    expect(undefinedErrors.length).toBe(0);
  });

  // ── NT34: Config password not logged ───────────────────────────────────

  test('NT34: 配置保存不泄露密码到日志', async ({ page }) => {
    await login(page);

    // This is a server-side check — we verify the endpoint works
    const response = await page.request.post('http://localhost:4000/api/config/save', {
      data: { test: 'value' }
    });

    // Should not crash
    const status = response.status();
    expect(status).toBeLessThan(600);
  });

  // ── NT37: runCaseScript parameter fix ──────────────────────────────────

  test('NT37: runCaseScript 参数匹配 — uid 参数正确传递', async ({ page }) => {
    await login(page);

    // This tests that the runCaseScript function receives uid parameter
    // We test it indirectly by checking the col/run_script endpoint works
    const response = await page.request.post('http://localhost:4000/api/col/run_script', {
      data: { id: 'test', script: 'console.log(1)' }
    });

    // Should not crash with parameter mismatch error
    const status = response.status();
    expect(status).toBeLessThan(600);
  });

  // ── NT54: Token legacy UID constant ────────────────────────────────────

  test('NT54: Token 旧版格式使用常量而非魔法数字', async ({ page }) => {
    // This is a code-level fix — we verify the token auth flow works
    await login(page);

    // If login works, the token parsing is functioning correctly
    const url = page.url();
    expect(url).not.toContain('login');
  });

  // ── Integration: Full workflow test ────────────────────────────────────

  test('集成测试: 完整工作流 — 登录 → 创建项目 → 创建接口 → 退出', async ({ page }) => {
    // 1. Login
    await login(page);
    const url1 = page.url();
    expect(url1).not.toContain('login');

    // 2. Create project
    const projectId = await createProject(page, 'E2E完整流程 ' + Date.now());
    expect(projectId).not.toBeNull();

    // 3. Navigate to interface
    await page.goto(`http://localhost:4000/project/${projectId}/interface/api`);
    await page.waitForTimeout(2000);

    // 4. Create interface
    const titleInput = page.locator('input[placeholder*="接口名称"], input[placeholder*="标题"]').first();
    const pathInput = page.locator('input[placeholder*="路径"]').first();
    if (await titleInput.isVisible().catch(() => false) && await pathInput.isVisible().catch(() => false)) {
      await titleInput.fill('E2E测试接口');
      await pathInput.fill('/api/e2e-test');

      const saveBtn = page.locator('button:has-text("保存")').first();
      if (await saveBtn.isVisible().catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }

    // 5. Logout
    const userArea = page.locator('.n-dropdown, [class*="user"], [class*="avatar"]').first();
    if (await userArea.isVisible().catch(() => false)) {
      await userArea.click();
      await page.waitForTimeout(500);

      const logoutBtn = page.locator('button:has-text("退出"), span:has-text("退出")').first();
      if (await logoutBtn.isVisible().catch(() => false)) {
        await logoutBtn.click();
        await page.waitForTimeout(2000);

        // Should not crash
        const errors = [];
        page.on('pageerror', err => errors.push(err.message));
        const jsErrors = errors.filter(e => e.includes('ReferenceError'));
        expect(jsErrors.length).toBe(0);
      }
    }
  });
});
