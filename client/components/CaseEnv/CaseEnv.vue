<template>
  <div class="case-env">
    <n-select
      v-model:value="currentEnv"
      :options="envOptions"
      placeholder="选择环境"
      size="small"
      style="width: 200px"
      @update:value="handleEnvChange"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMessage } from "naive-ui";
import axios from "axios";

const props = defineProps({
  projectId: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["change"]);

const message = useMessage();
const currentEnv = ref(null);
const envOptions = ref([]);

const handleEnvChange = (value) => {
  emit("change", value);
};

const fetchEnvs = async () => {
  try {
    // 通过项目详情获取环境列表
    const res = await axios.get(`/api/project/get?id=${props.projectId}`);
    if (res.data.errcode === 0) {
      envOptions.value = (res.data.data.env || []).map((env, idx) => ({
        label: env.name || `环境${idx + 1}`,
        value: idx,
      }));

      if (envOptions.value.length > 0) {
        currentEnv.value = envOptions.value[0].value;
      }
    }
  } catch (error) {
    message.error("获取环境列表失败");
  }
};

onMounted(() => {
  fetchEnvs();
});
</script>

<style scoped>
.case-env {
  display: inline-flex;
}
</style>
