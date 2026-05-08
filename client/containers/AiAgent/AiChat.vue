<template>
  <div class="ai-chat-container">
    <n-layout has-sider class="chat-layout">
      <n-layout-sider
        width="260"
        bordered
        class="chat-sider"
      >
        <div class="sider-header">
          <h3>AI 对话</h3>
        </div>
        <n-menu
          :options="menuOptions"
          :value="selectedAgentId"
          @update:value="handleSelectAgent"
        />
      </n-layout-sider>

      <n-layout class="chat-main">
        <n-layout-header class="chat-header" v-if="selectedAgent">
          <n-space justify="space-between" align="center">
            <span>与 <strong>{{ selectedAgent.name }}</strong> 对话中</span>
            <n-tag :type="agentTypeTag(selectedAgent.type)">{{ selectedAgent.type }}</n-tag>
          </n-space>
        </n-layout-header>

        <n-layout-content class="chat-content">
          <div class="messages-container" ref="messagesContainer">
            <div v-if="messages.length === 0" class="empty-tip">
              <n-empty description="请选择 AI 助手开始对话" />
            </div>
            <div
              v-for="(msg, index) in messages"
              :key="index"
              class="message-item"
              :class="msg.role"
            >
              <div class="message-avatar">
                <n-avatar
                  v-if="msg.role === 'user'"
                  :style="{ backgroundColor: '#2080f0' }"
                >
                  {{ userInitial }}
                </n-avatar>
                <n-avatar
                  v-else
                  :style="{ backgroundColor: '#f0a020' }"
                >
                  AI
                </n-avatar>
              </div>
              <div class="message-bubble">
                <div class="message-role">{{ msg.role === 'user' ? '我' : selectedAgent?.name }}</div>
                <div class="message-content" v-if="msg.role === 'assistant'" v-html="renderMarkdown(msg.content)"></div>
                <div class="message-content" v-else>{{ msg.content }}</div>
              </div>
            </div>
            <div v-if="sending" class="message-item assistant">
              <div class="message-avatar">
                <n-avatar :style="{ backgroundColor: '#f0a020' }">AI</n-avatar>
              </div>
              <div class="message-bubble">
                <n-spin size="small" />
                <span style="margin-left: 8px;">AI 正在思考...</span>
              </div>
            </div>
          </div>
        </n-layout-content>

        <n-layout-footer class="chat-footer">
          <n-form v-if="!selectedAgent" class="no-agent-tip">
            <n-alert type="warning" :show-icon="true">
              请先在左侧选择一个 AI 助手
            </n-alert>
          </n-form>
          <n-form v-else @submit.prevent="handleSend">
            <n-input
              v-model:value="inputMessage"
              type="textarea"
              placeholder="输入您的问题，按 Enter 发送，Shift+Enter 换行"
              :autosize="{ minRows: 2, maxRows: 6 }"
              :disabled="sending"
              @keydown="handleKeyDown"
            />
            <n-space justify="end" style="margin-top: 8px;">
              <n-button
                type="primary"
                @click="handleSend"
                :loading="sending"
                :disabled="!inputMessage.trim()"
              >
                发送
              </n-button>
              <n-button
                @click="handleClear"
                :disabled="messages.length === 0"
              >
                清空对话
              </n-button>
            </n-space>
          </n-form>
        </n-layout-footer>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from "vue";
import { useMessage, NAvatar, NEmpty, NSpin, NAlert, NTag, NMenu, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NLayoutFooter, NSpace, NButton, NInput, NForm } from "naive-ui";
import axios from "axios";
import { marked } from "marked";

const message = useMessage();
const inputMessage = ref("");
const sending = ref(false);
const messages = ref([]);
const agents = ref([]);
const selectedAgentId = ref(null);
const selectedAgent = ref(null);
const messagesContainer = ref(null);

const userInitial = computed(() => {
  const email = localStorage.getItem("email") || "";
  return email.charAt(0).toUpperCase();
});

const menuOptions = computed(() => {
  return agents.value.map((agent) => ({
    label: agent.name,
    key: agent._id,
    extra: () => h(NTag, { size: "small", type: agentTypeTag(agent.type) }, { default: () => agent.type }),
  }));
});

const agentTypeTag = (type) => {
  const map = { deepseek: "info", openai: "success", claude: "warning", gemini: "default", custom: "default" };
  return map[type] || "default";
};

const fetchAgents = async () => {
  try {
    const res = await axios.get("/api/ai/agents");
    if (res.data.errcode === 0) {
      agents.value = res.data.data || [];
    }
  } catch (error) {
    message.error("获取助手列表失败");
  }
};

const handleSelectAgent = (key) => {
  selectedAgentId.value = key;
  selectedAgent.value = agents.value.find((a) => a._id.toString() === key.toString());
  // 加载历史对话（暂时为空，后续可扩展）
  messages.value = [];
};

const handleSend = async () => {
  if (!inputMessage.value.trim() || sending.value) return;
  if (!selectedAgent.value) {
    message.warning("请先选择 AI 助手");
    return;
  }

  const userMsg = inputMessage.value.trim();
  messages.value.push({ role: "user", content: userMsg });
  inputMessage.value = "";
  sending.value = true;

  await nextTick();
  scrollToBottom();

  try {
    const chatMessages = messages.value.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const res = await axios.post("/api/ai/chat", {
      agentId: selectedAgent.value._id,
      messages: chatMessages,
    });

    if (res.data.errcode === 0) {
      messages.value.push({
        role: "assistant",
        content: res.data.data.content || "暂无回复",
      });
    } else {
      message.error(res.data.errmsg || "发送失败");
      // 移除最后一条用户消息
      messages.value.pop();
    }
  } catch (error) {
    message.error("发送失败：" + (error.message || "未知错误"));
    messages.value.pop();
  } finally {
    sending.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const handleKeyDown = (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

const handleClear = () => {
  messages.value = [];
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const renderMarkdown = (text) => {
  if (!text) return "";
  try {
    return marked(text);
  } catch {
    return text;
  }
};

onMounted(() => {
  fetchAgents();
});
</script>

<style scoped>
.ai-chat-container {
  height: calc(100vh - 64px);
}

.chat-layout {
  height: 100%;
}

.chat-sider {
  background: #f7f8fa;
}

.sider-header {
  padding: 16px;
  border-bottom: 1px solid #efeff5;
}

.sider-header h3 {
  margin: 0;
  font-size: 16px;
}

.chat-main {
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 12px 16px;
  border-bottom: 1px solid #efeff5;
  background: #fff;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f7f8fa;
}

.messages-container {
  max-width: 800px;
  margin: 0 auto;
}

.message-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-item.user .message-bubble {
  background: #2080f0;
  color: #fff;
}

.message-role {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #999;
}

.message-item.user .message-role {
  color: rgba(255, 255, 255, 0.8);
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.message-content :deep(pre) {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.message-content :deep(code) {
  font-family: monospace;
}

.chat-footer {
  padding: 12px 16px;
  border-top: 1px solid #efeff5;
  background: #fff;
}

.no-agent-tip {
  text-align: center;
}
</style>
