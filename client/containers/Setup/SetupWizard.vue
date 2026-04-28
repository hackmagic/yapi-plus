<template>
  <div class="setup-wizard">
    <n-card class="wizard-card" title="YAPI Plus 初始化配置" :bordered="false">
      <n-alert type="info" style="margin-bottom: 24px;">
        欢迎使用 YAPI Plus！请完成以下配置步骤以初始化系统。
      </n-alert>

      <n-steps :current="currentStep" :status="stepStatus">
        <n-step title="数据库配置" description="配置 MongoDB 数据库连接" />
        <n-step title="管理员账号" description="设置管理员账号和密码" />
        <n-step title="邮件配置" description="配置邮件服务（可选）" />
      </n-steps>

      <div class="step-content">
        <!-- 步骤1: 数据库配置 -->
        <div v-if="currentStep === 1" class="step-panel">
          <n-form
            ref="dbFormRef"
            :model="dbConfig"
            :rules="dbRules"
            label-placement="left"
            label-width="120"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="连接方式" path="connectionType">
              <n-radio-group v-model:value="dbConfig.connectionType">
                <n-radio value="simple">简单配置</n-radio>
                <n-radio value="connectionString">连接字符串</n-radio>
              </n-radio-group>
            </n-form-item>

            <template v-if="dbConfig.connectionType === 'connectionString'">
              <n-form-item label="连接字符串" path="connectString">
                <n-input
                  v-model:value="dbConfig.connectString"
                  placeholder="mongodb://user:password@host:port/database"
                  type="textarea"
                  :rows="3"
                />
                <template #extra>
                  示例: mongodb://yapi:yapi@127.0.0.1:27017/yapi
                </template>
              </n-form-item>
            </template>

            <template v-else>
              <n-form-item label="服务器地址" path="servername">
                <n-input v-model:value="dbConfig.servername" placeholder="127.0.0.1" />
              </n-form-item>

              <n-form-item label="端口" path="port">
                <n-input-number v-model:value="dbConfig.port" :min="1" :max="65535" />
              </n-form-item>

              <n-form-item label="数据库名" path="DATABASE">
                <n-input v-model:value="dbConfig.DATABASE" placeholder="yapi" />
              </n-form-item>

              <n-form-item label="用户名" path="user">
                <n-input v-model:value="dbConfig.user" placeholder="可选" />
              </n-form-item>

              <n-form-item label="密码" path="pass">
                <n-input v-model:value="dbConfig.pass" type="password" placeholder="可选" show-password-on="click" />
              </n-form-item>

              <n-form-item label="认证数据库" path="authSource">
                <n-input v-model:value="dbConfig.authSource" placeholder="可选，默认为admin" />
              </n-form-item>
            </template>

            <n-form-item>
              <n-button
                type="primary"
                :loading="testingDb"
                @click="testDatabase"
                style="margin-right: 12px;"
              >
                测试连接
              </n-button>
              <n-text :type="dbTestResult?.success ? 'success' : 'error'">
                {{ dbTestResult?.message }}
              </n-text>
            </n-form-item>
          </n-form>
        </div>

        <!-- 步骤2: 管理员账号 -->
        <div v-if="currentStep === 2" class="step-panel">
          <n-form
            ref="adminFormRef"
            :model="adminConfig"
            :rules="adminRules"
            label-placement="left"
            label-width="120"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="管理员邮箱" path="adminAccount">
              <n-input v-model:value="adminConfig.adminAccount" placeholder="admin@admin.com" />
              <template #extra>
                用于登录系统的管理员账号
              </template>
            </n-form-item>

            <n-form-item label="初始密码" path="adminPassword">
              <n-input
                v-model:value="adminConfig.adminPassword"
                type="password"
                placeholder="ymfe.org"
                show-password-on="click"
              />
              <template #extra>
                默认密码为 ymfe.org，建议首次登录后修改
              </template>
            </n-form-item>
          </n-form>
        </div>

        <!-- 步骤3: 邮件配置 -->
        <div v-if="currentStep === 3" class="step-panel">
          <n-form
            ref="mailFormRef"
            :model="mailConfig"
            label-placement="left"
            label-width="120"
            require-mark-placement="right-hanging"
          >
            <n-form-item label="启用邮件">
              <n-switch v-model:value="mailConfig.enable" />
            </n-form-item>

            <template v-if="mailConfig.enable">
              <n-form-item label="SMTP服务器" path="host">
                <n-input v-model:value="mailConfig.host" placeholder="smtp.163.com" />
              </n-form-item>

              <n-form-item label="端口" path="port">
                <n-input-number v-model:value="mailConfig.port" :min="1" :max="65535" />
              </n-form-item>

              <n-form-item label="发件人邮箱" path="from">
                <n-input v-model:value="mailConfig.from" placeholder="xxx@163.com" />
              </n-form-item>

              <n-form-item label="用户名" path="auth.user">
                <n-input v-model:value="mailConfig.auth.user" placeholder="xxx@163.com" />
              </n-form-item>

              <n-form-item label="密码" path="auth.pass">
                <n-input
                  v-model:value="mailConfig.auth.pass"
                  type="password"
                  placeholder="SMTP授权码"
                  show-password-on="click"
                />
              </n-form-item>
            </template>

            <n-alert type="warning" style="margin-top: 16px;">
              邮件配置用于系统通知，可以稍后在系统设置中修改。如不需要可以跳过。
            </n-alert>
          </n-form>
        </div>
      </div>

      <div class="wizard-actions">
        <n-button v-if="currentStep > 1" @click="prevStep" style="margin-right: 12px;">
          上一步
        </n-button>
        <n-button
          v-if="currentStep < 3"
          type="primary"
          @click="nextStep"
          :disabled="!canProceed"
        >
          下一步
        </n-button>
        <n-button
          v-if="currentStep === 3"
          type="primary"
          :loading="saving"
          @click="saveConfig"
        >
          完成配置
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useMessage } from 'naive-ui'
import axios from 'axios'

const message = useMessage()
const currentStep = ref(1)
const stepStatus = ref('process')
const testingDb = ref(false)
const dbTestResult = ref(null)
const saving = ref(false)

// 数据库配置
const dbFormRef = ref(null)
const dbConfig = reactive({
  connectionType: 'simple',
  servername: '127.0.0.1',
  port: 27017,
  DATABASE: 'yapi',
  user: '',
  pass: '',
  authSource: '',
  connectString: ''
})

const dbRules = {
  servername: { required: true, message: '请输入服务器地址', trigger: 'blur' },
  port: { required: true, message: '请输入端口', trigger: 'blur' },
  DATABASE: { required: true, message: '请输入数据库名', trigger: 'blur' }
}

// 管理员配置
const adminFormRef = ref(null)
const adminConfig = reactive({
  adminAccount: 'admin@admin.com',
  adminPassword: 'ymfe.org'
})

const adminRules = {
  adminAccount: {
    required: true,
    type: 'email',
    message: '请输入有效的邮箱地址',
    trigger: 'blur'
  },
  adminPassword: { required: true, message: '请输入密码', trigger: 'blur' }
}

// 邮件配置
const mailFormRef = ref(null)
const mailConfig = reactive({
  enable: false,
  host: 'smtp.163.com',
  port: 465,
  from: '',
  auth: {
    user: '',
    pass: ''
  }
})

// 计算是否可以继续
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return dbTestResult.value?.success === true
  }
  if (currentStep.value === 2) {
    return adminConfig.adminAccount && adminConfig.adminPassword
  }
  return true
})

// 测试数据库连接
const testDatabase = async () => {
  const valid = await dbFormRef.value?.validate()
  if (!valid) return

  testingDb.value = true
  dbTestResult.value = null

  try {
    const config = dbConfig.connectionType === 'connectionString'
      ? { connectString: dbConfig.connectString }
      : {
          servername: dbConfig.servername,
          port: dbConfig.port,
          DATABASE: dbConfig.DATABASE,
          user: dbConfig.user,
          pass: dbConfig.pass,
          authSource: dbConfig.authSource
        }

    const res = await axios.post('/api/config/test-db', config)
    if (res.data.errcode === 0) {
      dbTestResult.value = { success: true, message: '数据库连接成功' }
      message.success('数据库连接测试成功')
    } else {
      dbTestResult.value = { success: false, message: res.data.errmsg }
      message.error(res.data.errmsg)
    }
  } catch (error) {
    dbTestResult.value = { success: false, message: '连接失败，请检查配置' }
    message.error('数据库连接测试失败')
  } finally {
    testingDb.value = false
  }
}

// 下一步
const nextStep = () => {
  if (currentStep.value === 1 && !dbTestResult.value?.success) {
    message.warning('请先测试数据库连接')
    return
  }
  currentStep.value++
}

// 上一步
const prevStep = () => {
  currentStep.value--
}

// 保存配置
const saveConfig = async () => {
  saving.value = true

  try {
    const config = {
      db: dbConfig.connectionType === 'connectionString'
        ? { connectString: dbConfig.connectString }
        : {
            servername: dbConfig.servername,
            port: dbConfig.port,
            DATABASE: dbConfig.DATABASE,
            user: dbConfig.user,
            pass: dbConfig.pass,
            authSource: dbConfig.authSource
          },
      adminAccount: adminConfig.adminAccount,
      adminPassword: adminConfig.adminPassword,
      mail: mailConfig.enable ? mailConfig : null,
      timeout: 120000
    }

    const res = await axios.post('/api/config/save', config)
    if (res.data.errcode === 0) {
      message.success('配置保存成功！')
      
      // 显示成功对话框
      setTimeout(() => {
        if (confirm('配置已完成！点击确定重启服务。')) {
          window.location.reload()
        }
      }, 500)
    } else {
      message.error(res.data.errmsg || '配置保存失败')
    }
  } catch (error) {
    message.error('配置保存失败')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.setup-wizard {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
}

.wizard-card {
  max-width: 800px;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.step-content {
  margin-top: 32px;
  min-height: 300px;
}

.step-panel {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.wizard-actions {
  margin-top: 32px;
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}
</style>
