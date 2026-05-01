<template>
  <div class="login-container">
    <!-- Chrome 浏览器提示 -->
    <n-alert v-if="!isChrome" type="warning" closable class="chrome-alert">
      YAPI 的接口测试等功能仅支持 Chrome 浏览器，请使用 Chrome 浏览器获得完整功能。
    </n-alert>

    <n-card title="YAPI Plus 登录" :bordered="false" class="login-card">
      <!-- 登录类型切换 (普通登录/LDAP) -->
      <n-radio-group v-if="isLDAP" v-model:value="loginType" name="loginType" class="login-type-group">
        <n-radio value="ldap">LDAP</n-radio>
        <n-radio value="normal">普通登录</n-radio>
      </n-radio-group>

      <n-form ref="formRef" :model="formData" :rules="rules" label-placement="left" label-width="80">
        <n-form-item label="用户名/邮箱" path="email">
          <n-input
            v-model:value="formData.email"
            placeholder="请输入邮箱或用户名"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <n-icon><PersonOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="mousedown"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <n-icon><KeyOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item>
          <n-space vertical :size="12" style="width: 100%">
            <n-button type="primary" block @click="handleLogin" :loading="loading">
              登录
            </n-button>
            <n-button text type="primary" @click="$router.push('/reg')">
              还没有账号？去注册
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMessage, useDialog } from "naive-ui";
import { useUserStore } from "../../store/user";
import axios from "axios";
import { PersonOutline, KeyOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const userStore = useUserStore();

const formRef = ref(null);
const loading = ref(false);
const loginType = ref("normal");

// 检测是否为 Chrome 浏览器
const isChrome = computed(() => {
  const ua = window.navigator.userAgent;
  return ua.indexOf("Chrome") > -1 && window.chrome;
});

// 检测是否启用 LDAP
const isLDAP = computed(() => {
  // 可以从 store 或配置中获取
  return false;
});

const formData = reactive({
  email: "",
  password: "",
});

// 邮箱验证规则
const emailRule = computed(() => {
  if (loginType.value === "ldap") {
    return { required: false };
  }
  return {
    required: true,
    message: "请输入正确的邮箱地址",
    trigger: ["blur", "input"],
  };
});

const rules = {
  email: emailRule,
  password: {
    required: true,
    message: "请输入密码",
    trigger: ["blur", "input"],
  },
};

const handleLogin = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;

  try {
    let res;
    if (isLDAP.value && loginType.value === "ldap") {
      // LDAP 登录
      res = await axios.post("/api/user/login_ldap", formData);
    } else {
      // 普通登录
      res = await axios.post("/api/user/login", formData);
    }

    if (res.data.errcode === 0) {
      message.success("登录成功!");
      userStore.setUser(res.data.data);
      // 登录成功后跳转到 /group 而不是 /
      router.push("/group");
    } else {
      message.error(res.data.errmsg || "登录失败");
    }
  } catch (error) {
    message.error("登录失败，请检查网络连接");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
</style>
