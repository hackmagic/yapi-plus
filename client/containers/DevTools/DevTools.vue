<template>
  <div class="devtools-page">
    <n-card title="开发者工具" :bordered="false">
      <n-tabs type="line" animated>
        <!-- Mock 规则测试 -->
        <n-tab-pane name="mock" tab="Mock 规则测试">
          <div class="tool-section">
            <h3>Mock 规则测试工具</h3>
            <p class="section-desc">输入 Mock.js 规则，查看生成的随机数据</p>

            <n-form :model="mockForm" label-placement="left" label-width="100">
              <n-form-item label="Mock 规则">
                <n-input
                  v-model:value="mockForm.rule"
                  type="textarea"
                  :rows="4"
                  placeholder="例如: {&quot;name|1-3&quot;: &quot;@name&quot;, &quot;age|18-60&quot;: 1}"
                />
              </n-form-item>
              <n-form-item>
                <n-space>
                  <n-button type="primary" @click="testMock">生成数据</n-button>
                  <n-button @click="mockForm.rule = ''; mockResult = ''">清空</n-button>
                </n-space>
              </n-form-item>
            </n-form>

            <div v-if="mockResult" class="result-block">
              <h4>生成结果</h4>
              <pre>{{ mockResult }}</pre>
            </div>
          </div>
        </n-tab-pane>

        <!-- JSON 格式化 -->
        <n-tab-pane name="json" tab="JSON 格式化">
          <div class="tool-section">
            <h3>JSON 格式化工具</h3>
            <p class="section-desc">输入 JSON 字符串，查看格式化后的结果</p>

            <n-form :model="jsonForm" label-placement="left" label-width="100">
              <n-form-item label="输入 JSON">
                <n-input
                  v-model:value="jsonForm.input"
                  type="textarea"
                  :rows="8"
                  placeholder="输入需要格式化的 JSON"
                />
              </n-form-item>
              <n-form-item>
                <n-space>
                  <n-button type="primary" @click="formatJson">格式化</n-button>
                  <n-button @click="compressJson">压缩</n-button>
                  <n-button @click="validateJson">校验</n-button>
                </n-space>
              </n-form-item>
            </n-form>

            <div v-if="jsonResult" class="result-block">
              <h4>{{ jsonResult.type }}</h4>
              <pre :class="{ 'error-text': jsonResult.error }">{{ jsonResult.content }}</pre>
            </div>
          </div>
        </n-tab-pane>

        <!-- UUID 生成 -->
        <n-tab-pane name="uuid" tab="UUID 生成">
          <div class="tool-section">
            <h3>UUID 生成工具</h3>
            <p class="section-desc">生成各种格式的唯一标识符</p>

            <n-space vertical :size="12">
              <n-button type="primary" @click="generateUuid('v4')">生成 UUID v4</n-button>
              <n-button @click="generateUuid('v1')">生成 UUID v1</n-button>

              <div v-if="uuidResult" class="result-block">
                <h4>生成的 UUID</h4>
                <n-input :value="uuidResult" readonly />
                <n-space style="margin-top: 8px">
                  <n-button size="small" @click="copyToClipboard(uuidResult)">复制</n-button>
                </n-space>
              </div>
            </n-space>
          </div>
        </n-tab-pane>

        <!-- URL 编解码 -->
        <n-tab-pane name="url" tab="URL 编解码">
          <div class="tool-section">
            <h3>URL 编解码工具</h3>
            <p class="section-desc">对 URL 进行编码和解码</p>

            <n-form :model="urlForm" label-placement="left" label-width="100">
              <n-form-item label="输入文本">
                <n-input
                  v-model:value="urlForm.input"
                  type="textarea"
                  :rows="4"
                  placeholder="输入需要编码/解码的文本"
                />
              </n-form-item>
              <n-form-item>
                <n-space>
                  <n-button type="primary" @click="encodeUrl">URL 编码</n-button>
                  <n-button @click="decodeUrl">URL 解码</n-button>
                </n-space>
              </n-form-item>
            </n-form>

            <div v-if="urlResult" class="result-block">
              <h4>结果</h4>
              <pre>{{ urlResult }}</pre>
            </div>
          </div>
        </n-tab-pane>

        <!-- Base64 编解码 -->
        <n-tab-pane name="base64" tab="Base64 编解码">
          <div class="tool-section">
            <h3>Base64 编解码工具</h3>
            <p class="section-desc">对字符串进行 Base64 编码和解码</p>

            <n-form :model="base64Form" label-placement="left" label-width="100">
              <n-form-item label="输入文本">
                <n-input
                  v-model:value="base64Form.input"
                  type="textarea"
                  :rows="4"
                  placeholder="输入需要编码/解码的文本"
                />
              </n-form-item>
              <n-form-item>
                <n-space>
                  <n-button type="primary" @click="encodeBase64">Base64 编码</n-button>
                  <n-button @click="decodeBase64">Base64 解码</n-button>
                </n-space>
              </n-form-item>
            </n-form>

            <div v-if="base64Result" class="result-block">
              <h4>结果</h4>
              <pre>{{ base64Result }}</pre>
            </div>
          </div>
        </n-tab-pane>

        <!-- 时间戳转换 -->
        <n-tab-pane name="timestamp" tab="时间戳转换">
          <div class="tool-section">
            <h3>时间戳转换工具</h3>
            <p class="section-desc">在时间戳和日期格式之间相互转换</p>

            <n-form :model="timestampForm" label-placement="left" label-width="120">
              <n-form-item label="当前时间戳">
                <n-input :value="currentTimestamp" readonly>
                  <template #suffix>
                    <n-button size="tiny" @click="copyToClipboard(currentTimestamp)">复制</n-button>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item label="毫秒时间戳">
                <n-input :value="currentTimestampMs" readonly>
                  <template #suffix>
                    <n-button size="tiny" @click="copyToClipboard(currentTimestampMs)">复制</n-button>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item label="时间戳">
                <n-input v-model:value="timestampForm.timestamp" placeholder="输入时间戳" />
              </n-form-item>
              <n-form-item>
                <n-space>
                  <n-button type="primary" @click="timestampToDate">转日期</n-button>
                  <n-button @click="dateToTimestamp">日期转时间戳</n-button>
                </n-space>
              </n-form-item>
              <n-form-item label="日期格式">
                <n-input v-model:value="timestampForm.date" placeholder="或输入日期格式" />
              </n-form-item>
            </n-form>

            <div v-if="timestampResult" class="result-block">
              <h4>转换结果</h4>
              <pre>{{ timestampResult }}</pre>
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";

const message = useMessage();

// Mock 规则测试
const mockForm = reactive({
  rule: '',
});
const mockResult = ref('');

// JSON 格式化
const jsonForm = reactive({
  input: '',
});
const jsonResult = ref(null);

// UUID 生成
const uuidResult = ref('');

// URL 编解码
const urlForm = reactive({
  input: '',
});
const urlResult = ref('');

// Base64 编解码
const base64Form = reactive({
  input: '',
});
const base64Result = ref('');

// 时间戳转换
const timestampForm = reactive({
  timestamp: '',
  date: '',
});
const timestampResult = ref('');
const currentTimestamp = ref('');
const currentTimestampMs = ref('');

let timestampInterval = null;

// 更新当前时间戳
const updateCurrentTimestamp = () => {
  const now = Date.now();
  currentTimestamp.value = Math.floor(now / 1000).toString();
  currentTimestampMs.value = now.toString();
};

// Mock 测试
const testMock = async () => {
  if (!mockForm.rule) {
    message.warning('请输入 Mock 规则');
    return;
  }
  try {
    const res = await axios.post('/api/project/mock', {
      rule: mockForm.rule,
    });
    mockResult.value = JSON.stringify(res.data, null, 2);
  } catch (e) {
    mockResult.value = 'Mock 测试需要后端 Mock 服务支持';
  }
};

// JSON 格式化
const formatJson = () => {
  if (!jsonForm.input) {
    message.warning('请输入 JSON 字符串');
    return;
  }
  try {
    const parsed = JSON.parse(jsonForm.input);
    jsonResult.value = {
      type: '格式化结果',
      content: JSON.stringify(parsed, null, 2),
      error: false,
    };
  } catch (e) {
    jsonResult.value = {
      type: 'JSON 格式错误',
      content: e.message,
      error: true,
    };
  }
};

const compressJson = () => {
  if (!jsonForm.input) {
    message.warning('请输入 JSON 字符串');
    return;
  }
  try {
    const parsed = JSON.parse(jsonForm.input);
    jsonResult.value = {
      type: '压缩结果',
      content: JSON.stringify(parsed),
      error: false,
    };
  } catch (e) {
    jsonResult.value = {
      type: 'JSON 格式错误',
      content: e.message,
      error: true,
    };
  }
};

const validateJson = () => {
  if (!jsonForm.input) {
    message.warning('请输入 JSON 字符串');
    return;
  }
  try {
    JSON.parse(jsonForm.input);
    jsonResult.value = {
      type: '校验结果',
      content: '✓ JSON 格式正确',
      error: false,
    };
  } catch (e) {
    jsonResult.value = {
      type: 'JSON 格式错误',
      content: e.message,
      error: true,
    };
  }
};

// UUID 生成
const generateUuid = (version) => {
  // 简单的 UUID 生成
  const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  let uuid = template.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  uuidResult.value = uuid;
};

// URL 编解码
const encodeUrl = () => {
  if (!urlForm.input) {
    message.warning('请输入文本');
    return;
  }
  urlResult.value = encodeURIComponent(urlForm.input);
};

const decodeUrl = () => {
  if (!urlForm.input) {
    message.warning('请输入文本');
    return;
  }
  try {
    urlResult.value = decodeURIComponent(urlForm.input);
  } catch (e) {
    urlResult.value = '解码失败: ' + e.message;
  }
};

// Base64 编解码
const encodeBase64 = () => {
  if (!base64Form.input) {
    message.warning('请输入文本');
    return;
  }
  base64Result.value = btoa(unescape(encodeURIComponent(base64Form.input)));
};

const decodeBase64 = () => {
  if (!base64Form.input) {
    message.warning('请输入文本');
    return;
  }
  try {
    base64Result.value = decodeURIComponent(escape(atob(base64Form.input)));
  } catch (e) {
    base64Result.value = '解码失败: 无效的 Base64 字符串';
  }
};

// 时间戳转换
const timestampToDate = () => {
  if (!timestampForm.timestamp) {
    message.warning('请输入时间戳');
    return;
  }
  try {
    const ts = parseInt(timestampForm.timestamp);
    const date = ts > 9999999999 ? new Date(ts) : new Date(ts * 1000);
    timestampResult.value = date.toLocaleString();
  } catch (e) {
    timestampResult.value = '转换失败: ' + e.message;
  }
};

const dateToTimestamp = () => {
  const dateStr = timestampForm.date || new Date().toISOString();
  try {
    const date = new Date(dateStr);
    timestampResult.value = Math.floor(date.getTime() / 1000).toString();
  } catch (e) {
    timestampResult.value = '转换失败: ' + e.message;
  }
};

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    message.success('已复制到剪贴板');
  });
};

onMounted(() => {
  updateCurrentTimestamp();
  timestampInterval = setInterval(updateCurrentTimestamp, 1000);
});

onUnmounted(() => {
  if (timestampInterval) {
    clearInterval(timestampInterval);
  }
});
</script>

<style scoped lang="scss">
.devtools-page {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
}

.tool-section {
  padding: 16px 0;

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  .section-desc {
    margin: 0 0 16px;
    font-size: 14px;
    color: #666;
  }
}

.result-block {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;

  h4 {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }

  pre {
    margin: 0;
    padding: 12px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 13px;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .error-text {
    color: #ed4014;
  }
}
</style>
