<template>
  <div class="home-container">
    <!-- 英雄区 -->
    <section class="hero-section">
      <div class="hero-bg" />
      <div class="hero-content">
        <div class="logo-wrapper">
          <LogoSVG class="logo-icon" />
          <span class="logo-text">YAPI Plus</span>
        </div>
        <h1 class="hero-title">高效、易用、功能强大的 API 管理平台</h1>
        <p class="hero-desc">
          旨在为开发、产品、测试人员提供更优雅的接口管理服务
        </p>
        <div class="hero-actions">
          <n-button type="primary" size="large" @click="$router.push('/login')">
            立即登录
          </n-button>
          <n-button size="large" @click="$router.push('/reg')">免费注册</n-button>
          <n-button size="large" quaternary tag="a" :href="docUrl" target="_blank">
            使用文档
          </n-button>
        </div>
      </div>
    </section>

    <!-- 功能特性 -->
    <section class="features-section">
      <div class="section-inner">
        <h2 class="section-title">核心功能</h2>
        <p class="section-desc">YAPI 让接口开发更简单高效</p>

        <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" :item-responsive="true">
          <n-gi span="3 m:1 l:1">
            <n-card class="feature-card" hoverable>
              <template #header>
                <div class="feature-header">
                  <n-icon :size="32" class="feature-icon"><AppsOutline /></n-icon>
                  <span>项目管理</span>
                </div>
              </template>
              <p class="feature-text">提供基本的项目分组、项目管理、接口管理功能，支持多项目协作。</p>
            </n-card>
          </n-gi>
          <n-gi span="3 m:1 l:1">
            <n-card class="feature-card" hoverable>
              <template #header>
                <div class="feature-header">
                  <n-icon :size="32" class="feature-icon"><GitNetworkOutline /></n-icon>
                  <span>接口管理</span>
                </div>
              </template>
              <p class="feature-text">
                基于 websocket 的多人协作接口编辑功能和类 Postman 测试工具。
              </p>
            </n-card>
          </n-gi>
          <n-gi span="3 m:1 l:1">
            <n-card class="feature-card" hoverable>
              <template #header>
                <div class="feature-header">
                  <n-icon :size="32" class="feature-icon"><CloudUploadOutline /></n-icon>
                  <span>Mock 服务</span>
                </div>
              </template>
              <p class="feature-text">基于 Mock.js，简单易用，功能强大，数据实时随机生成。</p>
            </n-card>
          </n-gi>
          <n-gi span="3 m:1 l:1">
            <n-card class="feature-card" hoverable>
              <template #header>
                <div class="feature-header">
                  <n-icon :size="32" class="feature-icon"><ExtensionPuzzleOutline /></n-icon>
                  <span>自动化测试</span>
                </div>
              </template>
              <p class="feature-text">支持接口用例管理，环境变量配置，一键批量测试。</p>
            </n-card>
          </n-gi>
          <n-gi span="3 m:1 l:1">
            <n-card class="feature-card" hoverable>
              <template #header>
                <div class="feature-header">
                  <n-icon :size="32" class="feature-icon"><PeopleOutline /></n-icon>
                  <span>团队协作</span>
                </div>
              </template>
              <p class="feature-text">扁平化管理模式，权限分级控制，组长负责制。</p>
            </n-card>
          </n-gi>
          <n-gi span="3 m:1 l:1">
            <n-card class="feature-card" hoverable>
              <template #header>
                <div class="feature-header">
                  <n-icon :size="32" class="feature-icon"><RocketOutline /></n-icon>
                  <span>数据导入/导出</span>
                </div>
              </template>
              <p class="feature-text">支持 Swagger、Postman、HAR 等多种格式导入导出。</p>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </section>

    <!-- Mock 服务介绍 -->
    <section class="mock-section">
      <div class="section-inner">
        <h2 class="section-title">功能强大的 Mock 服务</h2>
        <p class="section-desc">轻松编写接口，无需手动生成 Mock 数据</p>

        <n-grid :cols="2" :x-gap="24" responsive="screen" :item-responsive="true">
          <n-gi span="2 m:1 l:1">
            <n-card title="Mock 规则" class="mock-card">
              <p class="mock-desc">
                通过学习一些简单的 Mock 模板规则即可轻松编写接口，这将大大提高定义接口的效率，并且无需为编写 Mock 数据烦恼。
              </p>
              <div class="code-block">
                <pre><code>{
  "errcode|200-500": 200,
  "errmsg|4-8": "@string",
  "data": {
    "boolean|1": true,
    "array|2": ["Bob", "Jim"],
    "email": "@email"
  }
}</code></pre>
              </div>
            </n-card>
          </n-gi>
          <n-gi span="2 m:1 l:1">
            <n-card title="生成结果" class="mock-card">
              <p class="mock-desc">
                生成的 Mock 数据可以直接用 ajax 请求使用，也可以通过服务器代理使用（不需要修改项目一行代码）。
              </p>
              <div class="code-block">
                <pre><code>{
  "errcode": 304,
  "errmsg": "JtkMIoRu)N#ie^h%Z77[F)",
  "data": {
    "boolean": true,
    "array": ["Bob", "Jim", "Bob", "Jim"],
    "email": "bob.jones@example.com"
  }
}</code></pre>
              </div>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </section>

    <!-- 扁平化管理模式 -->
    <section class="manage-section">
      <div class="section-inner">
        <n-grid :cols="3" :x-gap="24" responsive="screen" :item-responsive="true">
          <n-gi span="0 m:2 l:2" class="manage-desc-col">
            <n-card class="manage-desc-card">
              <n-icon :size="48" class="manage-icon"><PeopleOutline /></n-icon>
              <h3>扁平化管理模式</h3>
              <p>
                接口管理的逻辑较为复杂，操作频率高，层层审批将严重拖慢生产效率。YAPI 将扁平化管理模式的思想引入到产品的权限管理中。
              </p>
              <p>
                超级管理员拥有最高权限，将权限分配给若干组长，组长对分组或项目负责。
              </p>
            </n-card>
          </n-gi>
          <n-gi span="3 m:1 l:1" class="role-col">
            <n-card class="role-card">
              <template #header>
                <div class="role-header">
                  <n-icon><ShieldOutline /></n-icon>
                  <span>超级管理员</span>
                </div>
              </template>
              <ul class="role-list">
                <li>创建分组</li>
                <li>分配组长</li>
                <li>管理所有成员信息</li>
              </ul>
            </n-card>
          </n-gi>
          <n-gi span="3 m:1 l:1" class="role-col">
            <n-card class="role-card">
              <template #header>
                <div class="role-header">
                  <n-icon><BriefcaseOutline /></n-icon>
                  <span>组长</span>
                </div>
              </template>
              <ul class="role-list">
                <li>创建项目</li>
                <li>管理分组或项目信息</li>
                <li>管理开发者与成员</li>
              </ul>
            </n-card>
          </n-gi>
        </n-grid>
      </div>
    </section>

    <!-- 开始使用 -->
    <section class="cta-section">
      <div class="cta-content">
        <h2 class="cta-title">准备好使用了吗？</h2>
        <p class="cta-desc">免费注册，立即开始使用 YAPI Plus</p>
        <p class="cta-link">
          <a :href="docUrl" target="_blank">查看使用文档 →</a>
        </p>
      </div>
    </section>

    <!-- 开源信息 -->
    <section class="opensource-section">
      <div class="opensource-content">
        <p class="copyright">
          <a href="https://github.com/hackmagic/yapi-plus" target="_blank">@2026 yapi plus</a>
          基于 yapi 开发 · MIT License
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import LogoSVG from "@/components/LogoSVG/LogoSVG.vue";
import { NIcon } from "naive-ui";
import {
  AppsOutline,
  GitNetworkOutline,
  CloudUploadOutline,
  ExtensionPuzzleOutline,
  PeopleOutline,
  RocketOutline,
  ShieldOutline,
  BriefcaseOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const userStore = useUserStore();

const docUrl = "https://hellosean1025.github.io/yapi";
const currentYear = computed(() => new Date().getFullYear());

onMounted(() => {
  // 如果已登录，跳转到 group 页面
  if (userStore.isLogin) {
    router.replace("/group");
  }
});
</script>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

// 英雄区
.hero-section {
  position: relative;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  z-index: 1;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  .logo-icon {
    width: 48px;
    height: 48px;
  }

  .logo-text {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
  }
}

.hero-title {
  font-size: 36px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
  line-height: 1.3;
}

.hero-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

// 内容区
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 8px;
  color: #333;
}

.section-desc {
  font-size: 16px;
  text-align: center;
  color: #666;
  margin: 0 0 32px;
}

// 功能特性区
.features-section {
  padding: 60px 0;
  background: #fff;
}

.feature-card {
  height: 100%;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .feature-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .feature-icon {
    color: #2395f1;
  }

  .feature-text {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }
}

// Mock 服务区
.mock-section {
  padding: 60px 0;
  background: #f5f7fa;
}

.mock-card {
  height: 100%;

  .mock-desc {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .code-block {
    background: #1e1e1e;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;

    pre {
      margin: 0;

      code {
        font-family: "Consolas", "Monaco", "Courier New", monospace;
        font-size: 13px;
        color: #d4d4d4;
        line-height: 1.5;
      }
    }
  }
}

// 管理模式区
.manage-section {
  padding: 60px 0;
  background: #fff;
}

.manage-desc-card {
  height: 100%;

  .manage-icon {
    color: #2395f1;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 12px;
    font-size: 20px;
    color: #333;
  }

  p {
    margin: 0 0 12px;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.role-col {
  .role-card {
    height: 100%;

    .role-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #333;
    }

    .role-list {
      margin: 0;
      padding-left: 20px;
      color: #666;
      font-size: 14px;
      line-height: 1.8;

      li {
        margin-bottom: 4px;
      }
    }
  }
}

// 底部 CTA
.cta-section {
  padding: 80px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.cta-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.cta-link {
  margin-top: 16px;

  a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }
}

// 开源信息
.opensource-section {
  padding: 24px;
  background: #1a1a2e;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.opensource-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.copyright {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 16px 40px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: 24px;
  }

  .manage-desc-col {
    order: -1;
  }

  .role-col {
    margin-bottom: 16px;
  }
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.project-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.project-item:hover {
  border-color: #2080f0;
  background: #fafafa;
}

.project-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.project-info {
  flex: 1;
  min-width: 0;
}

.project-info h4 {
  margin: 0 0 4px;
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.project-info p {
  margin: 0 0 8px;
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

<style scoped lang="scss">
.home-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

// 英雄区
.hero-section {
  position: relative;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  z-index: 1;
}

.logo-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  .logo-icon {
    width: 48px;
    height: 48px;
  }

  .logo-text {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
  }
}

.hero-title {
  font-size: 36px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 16px;
  line-height: 1.3;
}

.hero-desc {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 32px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

// 内容区
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 8px;
  color: #333;
}

.section-desc {
  font-size: 16px;
  text-align: center;
  color: #666;
  margin: 0 0 32px;
}

// 功能特性区
.features-section {
  padding: 60px 0;
  background: #fff;
}

.feature-card {
  height: 100%;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  }

  .feature-header {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .feature-icon {
    color: #2395f1;
  }

  .feature-text {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
  }
}

// Mock 服务区
.mock-section {
  padding: 60px 0;
  background: #f5f7fa;
}

.mock-card {
  height: 100%;

  .mock-desc {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  .code-block {
    background: #1e1e1e;
    border-radius: 6px;
    padding: 16px;
    overflow-x: auto;

    pre {
      margin: 0;

      code {
        font-family: "Consolas", "Monaco", "Courier New", monospace;
        font-size: 13px;
        color: #d4d4d4;
        line-height: 1.5;
      }
    }
  }
}

// 管理模式区
.manage-section {
  padding: 60px 0;
  background: #fff;
}

.manage-desc-card {
  height: 100%;

  .manage-icon {
    color: #2395f1;
    margin-bottom: 16px;
  }

  h3 {
    margin: 0 0 12px;
    font-size: 20px;
    color: #333;
  }

  p {
    margin: 0 0 12px;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.role-col {
  .role-card {
    height: 100%;

    .role-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #333;
    }

    .role-list {
      margin: 0;
      padding-left: 20px;
      color: #666;
      font-size: 14px;
      line-height: 1.8;

      li {
        margin-bottom: 4px;
      }
    }
  }
}

// 底部 CTA
.cta-section {
  padding: 80px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 8px;
}

.cta-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.cta-link {
  margin-top: 16px;

  a {
    color: rgba(255, 255, 255, 0.85);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s;

    &:hover {
      color: #fff;
    }
  }
}

// 开源信息
.opensource-section {
  padding: 24px;
  background: #1a1a2e;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.opensource-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.copyright {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);

  a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;

    &:hover {
      color: #fff;
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 16px 40px;
  }

  .hero-title {
    font-size: 28px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .section-title {
    font-size: 24px;
  }

  .manage-desc-col {
    order: -1;
  }

  .role-col {
    margin-bottom: 16px;
  }
}
</style>
