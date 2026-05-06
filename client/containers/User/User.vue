<template>
  <div class="user-page">
    <n-layout has-sider style="min-height: calc(100vh - 60px)">
      <n-layout-sider bordered :width="200">
        <div class="user-profile">
          <n-avatar :size="80" :style="{ backgroundColor: '#2080f0' }">
            {{ userStore.username?.charAt(0)?.toUpperCase() || "U" }}
          </n-avatar>
          <div class="user-name">{{ userStore.username }}</div>
          <div class="user-email">{{ userStore.email }}</div>
        </div>

        <n-menu :value="activeMenu" :options="menuOptions" @update:value="handleMenuSelect" />
      </n-layout-sider>

      <n-layout-content content-style="padding: 24px;">
        <n-card v-if="activeMenu === 'profile'" title="个人资料">
          <n-form
            ref="formRef"
            :model="userForm"
            :rules="rules"
            label-placement="left"
            label-width="80px"
          >
            <n-form-item label="用户名" path="username">
              <n-input v-model:value="userForm.username" />
            </n-form-item>
            <n-form-item label="邮箱" path="email">
              <n-input v-model:value="userForm.email" disabled />
            </n-form-item>
            <n-form-item label="角色">
              <n-tag :type="userStore.role === 'admin' ? 'error' : 'default'">
                {{ userStore.role === "admin" ? "管理员" : "普通用户" }}
              </n-tag>
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleSave" :loading="saving"> 保存修改 </n-button>
            </n-form-item>
          </n-form>
        </n-card>

        <n-card v-else-if="activeMenu === 'password'" title="修改密码">
          <n-form
            ref="pwdFormRef"
            :model="pwdForm"
            :rules="pwdRules"
            label-placement="left"
            label-width="80px"
          >
            <n-form-item label="原密码" path="oldPassword">
              <n-input v-model:value="pwdForm.oldPassword" type="password" />
            </n-form-item>
            <n-form-item label="新密码" path="newPassword">
              <n-input v-model:value="pwdForm.newPassword" type="password" />
            </n-form-item>
            <n-form-item label="确认密码" path="confirmPassword">
              <n-input v-model:value="pwdForm.confirmPassword" type="password" />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleChangePassword" :loading="saving">
                修改密码
              </n-button>
            </n-form-item>
          </n-form>
        </n-card>

        <n-card v-else-if="activeMenu === 'settings'" title="个人设置">
          <n-space vertical>
            <n-form-item label="通知设置">
              <n-switch v-model:value="settings.emailNotification" />
            </n-form-item>
          </n-space>
        </n-card>

        <n-card v-else title="我的收藏">
          <n-empty description="暂无收藏" />
        </n-card>
      </n-layout-content>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, h } from "vue";
import { useRouter } from "vue-router";
import { useMessage } from "naive-ui";
import { useUserStore } from "@/store/user";
import axios from "axios";
import { PersonOutline, KeyOutline, SettingsOutline, BookmarksOutline } from "@vicons/ionicons5";

const router = useRouter();
const message = useMessage();
const userStore = useUserStore();

const activeMenu = ref("profile");
const saving = ref(false);

const userForm = ref({
  username: "",
});

const pwdForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const settings = ref({
  emailNotification: true,
});

const rules = {
  username: { required: true, message: "请输入用户名", trigger: "blur" },
};

const pwdRules = {
  oldPassword: { required: true, message: "请输入原密码", trigger: "blur" },
  newPassword: { required: true, message: "请输入新密码", trigger: "blur" },
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value) => value === pwdForm.value.newPassword,
      message: "两次输入的密码不一致",
      trigger: "blur",
    },
  ],
};

const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

const menuOptions = [
  { label: "个人资料", key: "profile", icon: renderIcon(PersonOutline) },
  { label: "修改密码", key: "password", icon: renderIcon(KeyOutline) },
  { label: "个人设置", key: "settings", icon: renderIcon(SettingsOutline) },
  { label: "我的收藏", key: "favorites", icon: renderIcon(BookmarksOutline) },
];

onMounted(() => {
  userForm.value.username = userStore.username;
});

const handleMenuSelect = (key) => {
  activeMenu.value = key;
};

const handleSave = async () => {
  saving.value = true;
  try {
    await userStore.updateUserInfo({ username: userForm.value.username });
    message.success("保存成功");
  } catch (e) {
    message.error(e.message || "保存失败");
  } finally {
    saving.value = false;
  }
};

const handleChangePassword = async () => {
  saving.value = true;
  try {
    await axios.post("/api/user/change_password", {
      oldPassword: pwdForm.value.oldPassword,
      newPassword: pwdForm.value.newPassword,
    });
    message.success("密码修改成功");
    pwdForm.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
  } catch (e) {
    message.error(e.response?.data?.errmsg || "修改失败");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped lang="scss">
.user-page {
  min-height: 100vh;
}

.user-profile {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;

  .user-name {
    margin-top: 12px;
    font-size: 18px;
    font-weight: 500;
  }

  .user-email {
    margin-top: 4px;
    font-size: 13px;
    color: #999;
  }
}
</style>
