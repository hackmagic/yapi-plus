---
banner:
  name: 'YAPI Plus'
  desc: '基于 YAPI 改造的现代化 API 管理平台，支持 Vue 3 + AI 助手'
  btns: 
    - { name: '开始', href: './documents/index.html', primary: true }
    - { name: 'Github >', href: 'https://github.com/hackmagic/yapi-plus' }
features: 
  - { name: 'Vue 3 + VitePlus', desc: '使用 Vue 3 + VitePlus 构建，开发体验更好' }
  - { name: 'Naive UI', desc: '现代化 UI 组件库，完全适配 Vue 3' }
  - { name: 'AI 助手', desc: '支持 DeepSeek、OpenAI、Claude 等 AI 模型' }
  - { name: '权限管理', desc: '成熟的团队管理扁平化项目权限配置满足各类企业的需求' }
  - { name: '可视化接口管理', desc: '基于 websocket 的多人协作接口编辑功能和类 postman 测试工具' }
  - { name: 'Mock Server', desc: '易用的 Mock Server，再也不用担心 mock 数据的生成了' }
  - { name: '自动化测试', desc: '完善的接口自动化测试,保证数据的正确性' }
  - { name: '数据导入', desc: '支持导入 swagger, postman, har 数据格式，方便迁移旧项目'}
  - { name: '插件机制', desc: '强大的插件机制，满足各类业务需求'}

footer:
  copyRight:
    name: 'YAPI Plus'
    href: 'https://github.com/hackmagic/yapi-plus'
  links:
    项目地址:
      - { name: 'GitHub', href: 'https://github.com/hackmagic/yapi-plus' }
      - { name: 'GitHub Issue', href: 'https://github.com/hackmagic/yapi-plus/issues' }
    原始项目:
      - { name: 'YMFE', href: 'https://ymfe.org/' }
      - { name: 'YAPI', href: 'https://github.com/YMFE/yapi' }

---
{
  (function(){
    banner.caption = '当前版本: v' + props.config.version
    return <div>
      <Homepage banner={banner} features={features} />
      <Footer distPath={props.page.distPath} title={props.footer.title} copyRight={props.footer.copyRight} links={props.footer.links} />
    </div>
  })()
}
