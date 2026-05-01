<template>
  <div class="system-settings">
    <n-card title="系统设置" :bordered="false">
      <n-tabs type="line">
        <n-tab-pane name="database" tab="数据库配置">
          <n-form ref="dbFormRef" :model="dbConfig" label-placement="left" label-width="120">
            <n-form-item label="服务器地址">
              <n-input v-model:value="dbConfig.servername" />
            </n-form-item>
            <n-form-item label="端口">
              <n-input-number v-model:value="dbConfig.port" />
            </n-form-item>
            <n-form-item label="数据库名">
              <n-input v-model:value="dbConfig.DATABASE" />
            </n-form-item>
            <n-form-item label="用户名">
              <n-input v-model:value="dbConfig.user" />
            </n-form-item>
            <n-form-item label="密码">
              <n-input v-model:value="dbConfig.pass" type="password" show-password-on="click" />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="saveDbConfig" :loading="saving"> 保存配置 </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <n-tab-pane name="admin" tab="管理员账号">
          <n-form ref="adminFormRef" :model="adminConfig" label-placement="left" label-width="120">
            <n-form-item label="管理员邮箱">
              <n-input v-model:value="adminConfig.adminAccount" />
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="saveAdminConfig" :loading="saving">
                保存配置
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <n-tab-pane name="mail" tab="邮件配置">
          <n-form ref="mailFormRef" :model="mailConfig" label-placement="left" label-width="120">
            <n-form-item label="启用邮件">
              <n-switch v-model:value="mailConfig.enable" />
            </n-form-item>
            <template v-if="mailConfig.enable">
              <n-form-item label="SMTP服务器">
                <n-input v-model:value="mailConfig.host" />
              </n-form-item>
              <n-form-item label="端口">
                <n-input-number v-model:value="mailConfig.port" />
              </n-form-item>
              <n-form-item label="发件人邮箱">
                <n-input v-model:value="mailConfig.from" />
              </n-form-item>
              <n-form-item label="用户名">
                <n-input v-model:value="mailConfig.auth.user" />
              </n-form-item>
              <n-form-item label="密码">
                <n-input
                  v-model:value="mailConfig.auth.pass"
                  type="password"
                  show-password-on="click"
                />
              </n-form-item>
            </template>
            <n-form-item>
              <n-button type="primary" @click="saveMailConfig" :loading="saving">
                保存配置
              </n-button>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";

const message = useMessage();
const saving = ref(false);

const dbConfig = reactive({
  servername: "127.0.0.1",
  port: 27017,
  DATABASE: "yapi",
  user: "",
  pass: "",
  authSource: "",
});

const adminConfig = reactive({
  adminAccount: "",
});

const mailConfig = reactive({
  enable: false,
  host: "smtp.163.com",
  port: 465,
  from: "",
  auth: {
    user: "",
    pass: "",
  },
});

const loadConfig = async () => {
  try {
    const res = await axios.get("/api/config/status");
    if (res.data.errcode === 0 && res.data.data) {
      const configs = res.data.data;

      if (configs.database) {
        Object.assign(dbConfig, configs.database);
      }

      if (configs.admin) {
        adminConfig.adminAccount = configs.admin.adminAccount;
      }

      if (configs.mail) {
        Object.assign(mailConfig, configs.mail);
      }
    }
  } catch (error) {
    message.error("加载配置失败");
  }
};

const saveDbConfig = async () => {
  saving.value = true;
  try {
    const res = await axios.post("/api/config/update-database", dbConfig);
    if (res.data.errcode === 0) {
      message.success("数据库配置保存成功");
    } else {
      message.error(res.data.errmsg);
    }
  } catch (error) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

const saveAdminConfig = async () => {
  saving.value = true;
  try {
    const res = await axios.post("/api/config/update-admin", adminConfig);
    if (res.data.errcode === 0) {
      message.success("管理员配置保存成功");
    } else {
      message.error(res.data.errmsg);
    }
  } catch (error) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

const saveMailConfig = async () => {
  saving.value = true;
  try {
    const res = await axios.post("/api/config/update-mail", mailConfig);
    if (res.data.errcode === 0) {
      message.success("邮件配置保存成功");
    } else {
      message.error(res.data.errmsg);
    }
  } catch (error) {
    message.error("保存失败");
  } finally {
    saving.value = false;
  }
};

onMounted(() => {
  loadConfig();
});
</script>

<style scoped>
.system-settings {
  padding: 24px;
}
</style>
