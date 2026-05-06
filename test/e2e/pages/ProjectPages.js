/**
 * Page Objects - Project Management
 */
const { TestUtils } = require('../utils/TestUtils');

class HeaderComponent {
  constructor(page) {
    this.page = page;
  }

  get userMenu() {
    return this.page.locator('.n-dropdown, [class*="user"], [class*="avatar"], .n-avatar').first();
  }

  get logoutButton() {
    return this.page.locator('button:has-text("退出"), span:has-text("退出"), div:has-text("退出")').first();
  }

  get homeLink() {
    return this.page.locator('a[href="/"], a[title*="首页"], .logo');
  }

  get searchInput() {
    return this.page.locator('input[placeholder*="搜索"], input[type="search"]');
  }

  get loginButton() {
    return this.page.locator('button:has-text("登录"), a:has-text("登录")').first();
  }

  get registerButton() {
    return this.page.locator('button:has-text("注册"), a:has-text("注册")').first();
  }

  async logout() {
    await this.userMenu.click();
    await this.page.waitForTimeout(500);
    await this.logoutButton.click();
  }

  async isLoggedIn() {
    const loginVisible = await this.loginButton.isVisible().catch(() => false);
    return !loginVisible;
  }
}

class ProjectListPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get addProjectButton() {
    return this.page.locator('a[href="/add-project"], button:has-text("添加"), button:has-text("新建")').first();
  }

  get projectItems() {
    return this.page.locator('[class*="project"], .project-card, [class*="card"]');
  }

  get projectName() {
    return this.page.locator('[class*="project-name"], .name, h3, h4');
  }

  get deleteButton() {
    return this.page.locator('button[title*="删除"], button[class*="delete"]');
  }

  async navigate(projectId) {
    if (projectId) {
      await this.utils.navigateTo(`/project/${projectId}`);
    } else {
      await this.utils.navigateTo('/group/1/project');
    }
  }

  async clickAddProject() {
    await this.addProjectButton.click();
  }

  async getProjectNames() {
    return await this.projectName.allTextContents();
  }
}

class AddProjectPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get nameInput() {
    return this.page.locator('input[placeholder*="项目名称"]').first();
  }

  get descriptionInput() {
    return this.page.locator('textarea[placeholder*="描述"]').first();
  }

  get basepathInput() {
    return this.page.locator('input[placeholder*="基本路径"], input[placeholder*="basepath"]').first();
  }

  get groupSelect() {
    return this.page.locator('.n-select').first();
  }

  get createButton() {
    return this.page.locator('button:has-text("创建项目")');
  }

  get cancelButton() {
    return this.page.locator('button:has-text("取消")');
  }

  async navigate() {
    await this.utils.navigateTo('/add-project');
  }

  async selectGroup() {
    await this.groupSelect.click();
    await this.page.waitForTimeout(500);
    const firstOption = this.page.locator('.n-select-option, .n-base-select-option').first();
    if (await firstOption.isVisible()) {
      await firstOption.click();
    }
  }

  async createProject(name, description = '', groupId = '') {
    await this.nameInput.fill(name);
    if (description) await this.descriptionInput.fill(description);
    await this.selectGroup();
    await this.createButton.click();
  }
}

class ProjectSettingPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get baseSettingTab() {
    return this.page.locator('a:has-text("基本设置"), [class*="setting"]:has-text("基本")');
  }

  get memberTab() {
    return this.page.locator('a:has-text("成员管理"), [class*="setting"]:has-text("成员")');
  }

  get tokenTab() {
    return this.page.locator('a:has-text("Token"), [class*="setting"]:has-text("Token")');
  }

  get envTab() {
    return this.page.locator('a:has-text("环境变量"), [class*="setting"]:has-text("环境")');
  }

  get projectNameInput() {
    return this.page.locator('input[name="name"]');
  }

  get saveButton() {
    return this.page.locator('button:has-text("保存"), button[type="submit"]');
  }

  async navigate(projectId) {
    await this.utils.navigateTo(`/project/${projectId}/setting`);
  }

  async updateProjectName(name) {
    await this.projectNameInput.fill(name);
    await this.saveButton.click();
  }
}

class InterfaceListPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get addInterfaceButton() {
    return this.page.locator('button:has-text("添加接口"), a[href*="add"]').first();
  }

  get interfaceItems() {
    return this.page.locator('[class*="interface"], .interface-item');
  }

  get searchInput() {
    return this.page.locator('input[placeholder*="搜索"], input[placeholder*="search"]').first();
  }

  get methodBadge() {
    return this.page.locator('[class*="method"], .badge');
  }

  get pathText() {
    return this.page.locator('[class*="path"], [class*="url"]');
  }

  async navigate(projectId) {
    await this.utils.navigateTo(`/project/${projectId}/interface`);
  }

  async navigateToApi(projectId) {
    await this.utils.navigateTo(`/project/${projectId}/interface/api`);
  }

  async clickAddInterface() {
    await this.addInterfaceButton.click();
  }

  async searchInterface(keyword) {
    await this.searchInput.fill(keyword);
    await this.page.waitForTimeout(500);
  }

  async getInterfaceList() {
    const items = await this.interfaceItems.all();
    const interfaces = [];
    for (const item of items) {
      const method = await item.locator(this.methodBadge).textContent();
      const path = await item.locator(this.pathText).textContent();
      interfaces.push({ method, path });
    }
    return interfaces;
  }
}

class InterfaceEditPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get titleInput() {
    return this.page.locator('input[placeholder*="接口名称"], input[placeholder*="标题"]').first();
  }

  get methodSelect() {
    return this.page.locator('.n-select').first();
  }

  get pathInput() {
    return this.page.locator('input[placeholder*="路径"]').first();
  }

  get descriptionInput() {
    return this.page.locator('textarea[placeholder*="描述"]').first();
  }

  get saveButton() {
    return this.page.locator('button:has-text("保存")').first();
  }

  get runButton() {
    return this.page.locator('button:has-text("运行"), a[href*="run"]');
  }

  get requestTab() {
    return this.page.locator('button:has-text("请求参数")');
  }

  get responseTab() {
    return this.page.locator('button:has-text("返回数据")');
  }

  get validationError() {
    return this.page.locator('.n-form-item-feedback, .n-message, [class*="error"]');
  }

  async navigate(projectId, interfaceId) {
    const path = interfaceId
      ? `/project/${projectId}/interface/api/${interfaceId}`
      : `/project/${projectId}/interface/api`;
    await this.utils.navigateTo(path);
  }

  async createInterface(title, method, path, description = '') {
    if (title) await this.titleInput.fill(title);
    if (method) await this.methodSelect.selectOption(method);
    if (path) await this.pathInput.fill(path);
    if (description) await this.descriptionInput.fill(description);
    await this.saveButton.click();
  }

  async runInterface() {
    await this.runButton.click();
  }

  async hasValidationError() {
    return await this.validationError.isVisible().catch(() => false);
  }
}

class GroupPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get addGroupButton() {
    return this.page.locator('a[href="/add-group"], button:has-text("添加分组")');
  }

  get groupItems() {
    return this.page.locator('[class*="group"], .group-item');
  }

  get groupName() {
    return this.page.locator('[class*="name"], h3, h4');
  }

  get projectCount() {
    return this.page.locator('[class*="count"], .count');
  }

  async navigate(groupId) {
    await this.utils.navigateTo(groupId ? `/group/${groupId}` : '/group/1');
  }

  async clickAddGroup() {
    await this.addGroupButton.click();
  }

  async getGroupList() {
    const items = await this.groupItems.all();
    const groups = [];
    for (const item of items) {
      const name = await item.locator(this.groupName).textContent();
      const count = await item.locator(this.projectCount).textContent();
      groups.push({ name, count });
    }
    return groups;
  }
}

class AddGroupPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get nameInput() {
    return this.page.locator('input[placeholder*="分组名称"], input[name="name"]').first();
  }

  get descriptionInput() {
    return this.page.locator('textarea[placeholder*="描述"], textarea[name="description"]').first();
  }

  get createButton() {
    return this.page.locator('button[type="submit"], button:has-text("创建")');
  }

  async navigate() {
    await this.utils.navigateTo('/add-group');
  }

  async createGroup(name, description = '') {
    await this.nameInput.fill(name);
    if (description) await this.descriptionInput.fill(description);
    await this.createButton.click();
  }
}

class FollowsPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get followItems() {
    return this.page.locator('[class*="follow"], [class*="item"], .n-list-item');
  }

  get unfollowButton() {
    return this.page.locator('button:has-text("取消关注"), button:has-text("取消")');
  }

  async navigate() {
    await this.utils.navigateTo('/follows');
  }

  async getFollowCount() {
    const items = await this.followItems.all();
    return items.length;
  }
}

class NewsPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get newsItems() {
    return this.page.locator('[class*="news"], [class*="log"], [class*="item"], .n-list-item');
  }

  get newsContent() {
    return this.page.locator('[class*="content"], [class*="desc"]');
  }

  async navigate() {
    await this.utils.navigateTo('/news');
  }

  async getNewsCount() {
    const items = await this.newsItems.all();
    return items.length;
  }
}

class ProjectDataPage {
  constructor(page) {
    this.page = page;
    this.utils = new TestUtils(page);
  }

  get exportButton() {
    return this.page.locator('button:has-text("导出"), a:has-text("导出")');
  }

  get importButton() {
    return this.page.locator('button:has-text("导入"), a:has-text("导入")');
  }

  async navigate(projectId) {
    await this.utils.navigateTo(`/project/${projectId}/setting`);
  }
}

module.exports = {
  HeaderComponent,
  ProjectListPage,
  AddProjectPage,
  ProjectSettingPage,
  InterfaceListPage,
  InterfaceEditPage,
  GroupPage,
  AddGroupPage,
  FollowsPage,
  NewsPage,
  ProjectDataPage
};