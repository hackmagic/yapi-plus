<template>
  <div class="reg-container">
    <n-card title="注册账号" :bordered="false" class="reg-card">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100"
      >
        <n-form-item label="用户名" path="username">
          <n-input
            v-model:value="formData.username"
            placeholder="请输入用户名"
            @keyup.enter="handleRegister"
          >
            <template #prefix>
              <n-icon><PersonOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="邮箱" path="email">
          <n-input
            v-model:value="formData.email"
            placeholder="请输入邮箱"
            @keyup.enter="handleRegister"
          >
            <template #prefix>
              <n-icon><MailOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="密码" path="password">
          <n-input
            v-model:value="formData.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="mousedown"
            @keyup.enter="handleRegister"
          >
            <template #prefix>
              <n-icon><KeyOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item label="确认密码" path="confirmPassword">
          <n-input
            v-model:value="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password-on="mousedown"
            @keyup.enter="handleRegister"
          >
            <template #prefix>
              <n-icon><KeyOutline /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item>
          <n-space vertical :size="12" style="width: 100%">
            <n-button type="primary" block @click="handleRegister" :loading="loading">
              注册
            </n-button>
            <n-button text type="primary" @click="$router.push('/login')">
              已有账号？去登录
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import axios from "axios";
import { PersonOutline, MailOutline, KeyOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const formRef = ref(null);
const loading = ref(false);

const formData = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// 自定义验证器：确认密码
const validateConfirmPassword = (rule, value) => {
  if (value !== formData.password) {
    return new Error("两次输入的密码不一致");
  }
  return true;
};

const rules = {
  username: {
    required: true,
    message: "请输入用户名",
    trigger: ["blur", "input"],
  },
  email: [
    { required: true, message: "请输入邮箱", trigger: ["blur", "input"] },
    {
      pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{1,})+$/,
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "input"],
    },
  ],
  password: {
    required: true,
    message: "请输入密码",
    trigger: ["blur", "input"],
  },
  confirmPassword: [
    { required: true, message: "请再次输入密码", trigger: ["blur", "input"] },
    { validator: validateConfirmPassword, message: "两次输入的密码不一致", trigger: ["blur", "input"] },
  ],
};

const handleRegister = async () => {
  const valid = await formRef.value?.validate();
  if (!valid) return;

  loading.value = true;
  try {
    // 发送注册请求
    const res = await axios.post("/api/user/reg", {
      email: formData.email,
      password: formData.password,
      username: formData.username,
    });

    if (res.data.errcode === 0) {
      message.success("注册成功!");
      router.push("/login");
    } else {
      message.error(res.data.errmsg || "注册失败");
    }
  } catch (error) {
    message.error("注册失败，请检查网络连接");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reg-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}
</style>
