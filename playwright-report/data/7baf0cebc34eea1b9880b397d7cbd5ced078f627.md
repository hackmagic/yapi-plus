# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance-tests.test.js >> Browser Console Tests >> should not have critical console errors
- Location: test\e2e\tests\performance-tests.test.js:101:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e8]:
    - generic [ref=e9]:
      - img [ref=e11]:
        - generic [ref=e13]: "Y"
      - generic [ref=e14]: YAPI Plus
    - heading "高效、易用、功能强大的 API 管理平台" [level=1] [ref=e15]
    - paragraph [ref=e16]: 旨在为开发、产品、测试人员提供更优雅的接口管理服务
    - generic [ref=e17]:
      - button "立即登录" [ref=e18] [cursor=pointer]:
        - generic [ref=e19]: 立即登录
      - button "免费注册" [ref=e20] [cursor=pointer]:
        - generic [ref=e21]: 免费注册
      - link "使用文档" [ref=e22] [cursor=pointer]:
        - /url: https://hellosean1025.github.io/yapi
        - generic [ref=e23]: 使用文档
  - generic [ref=e25]:
    - heading "核心功能" [level=2] [ref=e26]
    - paragraph [ref=e27]: YAPI 让接口开发更简单高效
    - generic [ref=e28]:
      - generic [ref=e30]:
        - heading "项目管理" [ref=e31]:
          - heading "项目管理" [ref=e32]:
            - generic [ref=e33]:
              - img [ref=e34]:
                - img [ref=e35]
              - generic [ref=e45]: 项目管理
        - paragraph [ref=e46]: 提供基本的项目分组、项目管理、接口管理功能，支持多项目协作。
      - generic [ref=e48]:
        - heading "接口管理" [ref=e49]:
          - heading "接口管理" [ref=e50]:
            - generic [ref=e51]:
              - img [ref=e52]:
                - img [ref=e53]
              - generic [ref=e59]: 接口管理
        - paragraph [ref=e60]: 基于 websocket 的多人协作接口编辑功能和类 Postman 测试工具。
      - generic [ref=e62]:
        - heading "Mock 服务" [ref=e63]:
          - heading "Mock 服务" [ref=e64]:
            - generic [ref=e65]:
              - img [ref=e66]:
                - img [ref=e67]
              - generic [ref=e70]: Mock 服务
        - paragraph [ref=e71]: 基于 Mock.js，简单易用，功能强大，数据实时随机生成。
      - generic [ref=e73]:
        - heading "自动化测试" [ref=e74]:
          - heading "自动化测试" [ref=e75]:
            - generic [ref=e76]:
              - img [ref=e77]:
                - img [ref=e78]
              - generic [ref=e80]: 自动化测试
        - paragraph [ref=e81]: 支持接口用例管理，环境变量配置，一键批量测试。
      - generic [ref=e83]:
        - heading "团队协作" [ref=e84]:
          - heading "团队协作" [ref=e85]:
            - generic [ref=e86]:
              - img [ref=e87]:
                - img [ref=e88]
              - generic [ref=e93]: 团队协作
        - paragraph [ref=e94]: 扁平化管理模式，权限分级控制，组长负责制。
      - generic [ref=e96]:
        - heading "数据导入/导出" [ref=e97]:
          - heading "数据导入/导出" [ref=e98]:
            - generic [ref=e99]:
              - img [ref=e100]:
                - img [ref=e101]
              - generic [ref=e104]: 数据导入/导出
        - paragraph [ref=e105]: 支持 Swagger、Postman、HAR 等多种格式导入导出。
  - generic [ref=e107]:
    - heading "功能强大的 Mock 服务" [level=2] [ref=e108]
    - paragraph [ref=e109]: 轻松编写接口，无需手动生成 Mock 数据
    - generic [ref=e110]:
      - generic [ref=e112]:
        - heading "Mock 规则" [ref=e113]:
          - heading "Mock 规则" [ref=e114]
        - paragraph [ref=e115]: 通过学习一些简单的 Mock 模板规则即可轻松编写接口，这将大大提高定义接口的效率，并且无需为编写 Mock 数据烦恼。
        - code [ref=e118]: "{ \"errcode|200-500\": 200, \"errmsg|4-8\": \"@string\", \"data\": { \"boolean|1\": true, \"array|2\": [\"Bob\", \"Jim\"], \"email\": \"@email\" } }"
      - generic [ref=e120]:
        - heading "生成结果" [ref=e121]:
          - heading "生成结果" [ref=e122]
        - paragraph [ref=e123]: 生成的 Mock 数据可以直接用 ajax 请求使用，也可以通过服务器代理使用（不需要修改项目一行代码）。
        - code [ref=e126]: "{ \"errcode\": 304, \"errmsg\": \"JtkMIoRu)N#ie^h%Z77[F)\", \"data\": { \"boolean\": true, \"array\": [\"Bob\", \"Jim\", \"Bob\", \"Jim\"], \"email\": \"bob.jones@example.com\" } }"
  - generic [ref=e129]:
    - generic [ref=e131]:
      - img [ref=e132]:
        - img [ref=e133]
      - heading "扁平化管理模式" [level=3] [ref=e138]
      - paragraph [ref=e139]: 接口管理的逻辑较为复杂，操作频率高，层层审批将严重拖慢生产效率。YAPI 将扁平化管理模式的思想引入到产品的权限管理中。
      - paragraph [ref=e140]: 超级管理员拥有最高权限，将权限分配给若干组长，组长对分组或项目负责。
    - generic [ref=e142]:
      - heading "超级管理员" [ref=e143]:
        - heading "超级管理员" [ref=e144]:
          - generic [ref=e145]:
            - img [ref=e146]:
              - img [ref=e147]
            - generic [ref=e149]: 超级管理员
      - list [ref=e150]:
        - listitem [ref=e151]: 创建分组
        - listitem [ref=e152]: 分配组长
        - listitem [ref=e153]: 管理所有成员信息
    - generic [ref=e155]:
      - heading "组长" [ref=e156]:
        - heading "组长" [ref=e157]:
          - generic [ref=e158]:
            - img [ref=e159]:
              - img [ref=e160]
            - generic [ref=e164]: 组长
      - list [ref=e165]:
        - listitem [ref=e166]: 创建项目
        - listitem [ref=e167]: 管理分组或项目信息
        - listitem [ref=e168]: 管理开发者与成员
  - generic [ref=e170]:
    - heading "准备好使用了吗？" [level=2] [ref=e171]
    - paragraph [ref=e172]: 免费注册，立即开始使用 YAPI Plus
    - paragraph [ref=e173]:
      - link "查看使用文档 →" [ref=e174] [cursor=pointer]:
        - /url: https://hellosean1025.github.io/yapi
  - paragraph [ref=e177]:
    - link "@2026 yapi plus" [ref=e178] [cursor=pointer]:
      - /url: https://github.com/hackmagic/yapi-plus
    - text: 基于 yapi 开发 · MIT License
```

# Test source

```ts
  21  |       
  22  |       const screenshot = await page.screenshot();
  23  |       expect(screenshot).toBeTruthy();
  24  |     });
  25  |   }
  26  | });
  27  | 
  28  | test.describe('Performance Tests', () => {
  29  |   test('should load homepage within 3 seconds', async ({ page }) => {
  30  |     const startTime = Date.now();
  31  |     await page.goto('http://localhost:4000/');
  32  |     const loadTime = Date.now() - startTime;
  33  |     
  34  |     console.log(`[Performance] Homepage load time: ${loadTime}ms`);
  35  |     expect(loadTime).toBeLessThan(3000);
  36  |   });
  37  | 
  38  |   test('should load login page within 2 seconds', async ({ page }) => {
  39  |     const startTime = Date.now();
  40  |     await page.goto('http://localhost:4000/login');
  41  |     const loadTime = Date.now() - startTime;
  42  |     
  43  |     console.log(`[Performance] Login page load time: ${loadTime}ms`);
  44  |     expect(loadTime).toBeLessThan(2000);
  45  |   });
  46  | 
  47  |   test('should measure Time to First Byte', async ({ page }) => {
  48  |     const startTime = Date.now();
  49  |     await page.goto('http://localhost:4000/');
  50  |     const endTime = Date.now();
  51  |     const ttfb = endTime - startTime;
  52  |     
  53  |     console.log(`[Performance] TTFB: ~${ttfb}ms`);
  54  |     expect(ttfb).toBeGreaterThan(0);
  55  |   });
  56  | 
  57  |   test('should measure page weight', async ({ page }) => {
  58  |     const response = await page.goto('http://localhost:4000/');
  59  |     const body = await response.body();
  60  |     const size = body.length;
  61  |     
  62  |     console.log(`[Performance] Page size: ${size} bytes`);
  63  |     expect(size).toBeLessThan(1024 * 1024);
  64  |   });
  65  | });
  66  | 
  67  | test.describe('Accessibility Tests', () => {
  68  |   test('should have proper alt text on images', async ({ page }) => {
  69  |     await page.goto('http://localhost:4000/');
  70  |     
  71  |     const images = await page.locator('img').all();
  72  |     for (const img of images) {
  73  |       const alt = await img.getAttribute('alt');
  74  |       console.log(`[Accessibility] Image alt: ${alt || '(missing)'}`);
  75  |     }
  76  |     expect(images.length).toBeGreaterThanOrEqual(0);
  77  |   });
  78  | 
  79  |   test('should have proper form labels', async ({ page }) => {
  80  |     await page.goto('http://localhost:4000/login');
  81  |     
  82  |     await page.waitForTimeout(1000);
  83  |     const inputs = await page.locator('.n-input input').all();
  84  |     for (const input of inputs) {
  85  |       const placeholder = await input.getAttribute('placeholder');
  86  |       console.log(`[Accessibility] Input placeholder: ${placeholder}`);
  87  |     }
  88  |     expect(inputs.length).toBeGreaterThan(0);
  89  |   });
  90  | 
  91  |   test('should have proper heading hierarchy', async ({ page }) => {
  92  |     await page.goto('http://localhost:4000/');
  93  |     
  94  |     await page.waitForTimeout(1000);
  95  |     const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  96  |     expect(headings.length).toBeGreaterThan(0);
  97  |   });
  98  | });
  99  | 
  100 | test.describe('Browser Console Tests', () => {
  101 |   test('should not have critical console errors', async ({ page }) => {
  102 |     const errors = [];
  103 |     page.on('console', msg => {
  104 |       if (msg.type() === 'error') {
  105 |         errors.push(msg.text());
  106 |       }
  107 |     });
  108 |     
  109 |     await page.goto('http://localhost:4000/');
  110 |     await page.waitForTimeout(2000);
  111 |     
  112 |     const criticalErrors = errors.filter(e => 
  113 |       !e.includes('favicon') && 
  114 |       !e.includes('404') &&
  115 |       !e.includes('net::')
  116 |     );
  117 |     
  118 |     console.log(`[Console] Errors found: ${criticalErrors.length}`);
  119 |     criticalErrors.forEach(e => console.log(`[Console] Error: ${e}`));
  120 |     
> 121 |     expect(criticalErrors.length).toBe(0);
      |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  122 |   });
  123 | });
```