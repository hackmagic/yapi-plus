<template>
  <div class="home-container">
    <!-- 背景装饰 -->
    <div class="home-bg">
      <div class="m-bg-mask m-bg-mask0"></div>
      <div class="m-bg-mask m-bg-mask1"></div>
      <div class="m-bg-mask m-bg-mask2"></div>
      <div class="m-bg-mask m-bg-mask3"></div>
    </div>

    <!-- 主内容区 -->
    <n-layout>
      <n-layout-content content-style="padding: 24px;">
        <!-- 欢迎区 -->
        <div class="hero-section">
          <n-grid :cols="2" :x-gap="24" responsive="screen" :item-responsive="true">
            <n-gi span="2 m:1 l:1">
              <div class="hero-content">
                <div class="logo-wrapper">
                  <LogoSVG />
                  <span class="logo-name">YAPI Plus</span>
                </div>
                <h1 class="hero-title">高效、易用、功能强大的API管理平台</h1>
                <p class="hero-desc">
                  旨在为开发、产品、测试人员提供更优雅的接口管理服务
                </p>
                <n-space style="margin-top: 24px;">
                  <n-button type="primary" size="large" @click="$router.push('/login')">
                    登录 / 注册
                  </n-button>
                  <n-button size="large" @click="$router.push('/reg')">
                    <a href="https://hellosean1025.github.io/yapi" target="_blank">使用文档</a>
                  </n-button>
                </n-space>
              </div>
            </n-gi>
            <n-gi span="0 m:1 l:1" class="hero-image-col">
              <div class="hero-image">
                <!-- 占位图片区 -->
              </div>
            </n-gi>
          </n-grid>
        </div>

        <!-- 功能特性 -->
        <div class="features-section">
          <h2 class="section-title">为API开发者设计的管理平台</h2>
          <p class="section-desc">
            YApi让接口开发更简单高效，让接口的管理更具可读性、可维护性，让团队协作更合理。
          </p>
          <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen" :item-responsive="true">
            <n-gi span="3 m:1 l:1">
              <n-card class="feature-card">
                <template #header>
                  <n-icon :size="32" class="feature-icon"><AppsOutline /></n-icon>
                  <span>项目管理</span>
                </template>
                <p>提供基本的项目分组，项目管理，接口管理功能</p>
              </n-card>
            </n-gi>
            <n-gi span="3 m:1 l:1">
              <n-card class="feature-card">
                <template #header>
                  <n-icon :size="32" class="feature-icon"><GitNetworkOutline /></n-icon>
                  <span>接口管理</span>
                </template>
                <p>
                  友好的接口文档，基于websocket的多人协作接口编辑功能和类postman测试工具，让多人协作成倍提升开发效率
                </p>
              </n-card>
            </n-gi>
            <n-gi span="3 m:1 l:1">
              <n-card class="feature-card">
                <template #header>
                  <n-icon :size="32" class="feature-icon"><CloudUploadOutline /></n-icon>
                  <span>MockServer</span>
                </template>
                <p>基于Mockjs，使用简单功能强大</p>
              </n-card>
            </n-gi>
          </n-grid>
        </div>

        <!-- Mock 服务详情 -->
        <div class="mock-section">
          <h2 class="section-title">功能强大的 Mock 服务</h2>
          <p class="section-desc">你想要的 Mock 服务都在这里</p>
          <n-grid :cols="2" :x-gap="24" responsive="screen" :item-responsive="true">
            <n-gi span="2 m:1 l:1">
              <n-card title="Mock 规则">
                <p class="mock-desc">
                  通过学习一些简单的 Mock
                  模板规则即可轻松编写接口，这将大大提高定义接口的效率，并且无需为编写 Mock 数据烦恼:
                  所有的数据都可以实时随机生成。
                </p>
                <div class="code-block">
                  <pre><code>{
  "errcode|200-500": 200,
  "errmsg|4-8": "@string",
  "data": {
    "boolean|1": true,
    "array|2": ["Bob", "Jim"],
    "combine": "@boolean & @array"
  }
}</code></pre>
                </div>
              </n-card>
            </n-gi>
            <n-gi span="2 m:1 l:1">
              <n-card title="生成的 Mock 数据">
                <p class="mock-desc">
                  生成的 Mock 数据可以直接用 ajax
                  请求使用，也可以通过服务器代理使用（不需要修改项目一行代码）
                </p>
                <div class="code-block">
                  <pre><code>{
  "errcode": 304,
  "errmsg": "JtkMIoRu)N#ie^h%Z77[F)",
  "data": {
    "boolean": true,
    "array": ["Bob", "Jim", "Bob", "Jim"],
    "combine": "true & Bob, Jim, Bob, Jim"
  }
}</code></pre>
                </div>
              </n-card>
            </n-gi>
          </n-grid>
        </div>

        <!-- 扁平化管理模式 -->
        <div class="manage-section">
          <n-grid :cols="3" :x-gap="24" responsive="screen" :item-responsive="true">
            <n-gi span="3 m:1 l:1">
              <n-card class="role-card">
                <h4>超级管理员(* N)</h4>
                <p class="item">- 创建分组</p>
                <p class="item">- 分配组长</p>
                <p class="item">- 管理所有成员信息</p>
              </n-card>
              <n-card class="role-card">
                <h4>组长(* N)</h4>
                <p class="item">- 创建项目</p>
                <p class="item">- 管理分组或项目的信息</p>
                <p class="item">- 管理开发者与成员</p>
              </n-card>
              <n-card class="role-card">
                <h4>开发者(* N) / 成员(* N)</h4>
                <p class="item">- 不允许创建分组</p>
                <p class="item">- 不允许修改分组或项目信息</p>
              </n-card>
            </n-gi>
            <n-gi span="0 m:2 l:2" class="manage-desc-col">
              <n-card class="manage-desc-card">
                <n-icon :size="48" class="manage-icon"><PeopleOutline /></n-icon>
                <h3>扁平化管理模式</h3>
                <p>
                  接口管理的逻辑较为复杂，操作频率高，层层审批将严重拖慢生产效率，因此传统的金字塔管理模式并不适用。
                </p>
                <p>
                  YAPI
                  将扁平化管理模式的思想引入到产品的权限管理中，超级管理员拥有最高的权限，并将权限分配给若干组长，超级管理员只需管理组长即可，实际上管理YAPI各大分组与项目的是"组长"。组长对分组或项目负责，一般由BU负责人/项目负责人担任。
                </p>
              </n-card>
            </n-gi>
          </n-grid>
        </div>

        <!-- 底部提示 -->
        <div class="cta-section">
          <n-card class="cta-card">
            <h3 class="cta-title">准备好使用了吗？</h3>
            <p class="cta-desc">注册账号尽请使用吧，查看使用文档了解更多信息</p>
            <n-space style="margin-top: 16px;">
              <n-button type="primary" @click="$router.push('/login')">登录 / 注册</n-button>
              <n-button>
                <a href="https://hellosean1025.github.io/yapi" target="_blank">使用文档</a>
              </n-button>
            </n-space>
          </n-card>
        </div>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/user";
import LogoSVG from "../../components/LogoSVG/LogoSVG.vue";
import { NIcon } from "naive-ui";
import {
  AppsOutline,
  GitNetworkOutline,
  CloudUploadOutline,
  PeopleOutline,
} from "@vicons/ionicons5";

const router = useRouter();
const userStore = useUserStore();

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
  background-color: #eceef1;
}

// 背景装饰
.home-bg {
  position: relative;
  overflow: hidden;

  .m-bg-mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;

    &.m-bg-mask0 {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 400px;
    }

    &.m-bg-mask1,
    &.m-bg-mask2,
    &.m-bg-mask3 {
      display: none;
    }
  }
}

// 英雄区
.hero-section {
  position: relative;
  padding: 60px 24px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;

  .logo-name {
    font-size: 28px;
    font-weight: 600;
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
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.hero-image-col {
  display: none;
}

// 功能特性区
.features-section {
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 12px;
  color: #333;
}

.section-desc {
  font-size: 14px;
  text-align: center;
  color: #666;
  margin: 0 0 32px;
}

.feature-card {
  text-align: center;
  height: 100%;

  :deep(.n-card-header) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 18px;
    font-weight: 600;
  }

  .feature-icon {
    color: #2395f1;
  }

  p {
    color: #666;
    font-size: 14px;
    line-height: 1.6;
  }
}

// Mock 服务区
.mock-section {
  padding: 40px 24px;
  background-color: #fff;
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
}

.mock-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.code-block {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
  overflow-x: auto;

  pre {
    margin: 0;

    code {
      font-family: "Consolas", "Monaco", "Courier New", monospace;
      font-size: 13px;
      color: #333;
    }
  }
}

// 管理模式区
.manage-section {
  padding: 40px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.role-card {
  margin-bottom: 16px;

  h4 {
    margin: 0 0 12px;
    font-size: 16px;
    color: #333;
  }

  .item {
    margin: 0 0 8px;
    font-size: 14px;
    color: #666;
  }
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

// 底部提示区
.cta-section {
  padding: 40px 24px 60px;
  max-width: 1200px;
  margin: 0 auto;
}

.cta-card {
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;

  .cta-title {
    margin: 0 0 8px;
    font-size: 24px;
    color: #fff;
  }

  .cta-desc {
    margin: 0;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
  }

  :deep(.n-card__content) {
    padding: 32px;
  }
}

// 响应式
@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .section-title {
    font-size: 20px;
  }
}
</style>
