<template>
  <div class="key-value-editor">
    <n-button type="primary" size="small" @click="addItem" style="margin-bottom: 8px">
      添加
    </n-button>

    <div v-for="(item, index) in items" :key="index" class="row">
      <n-input v-model:value="item.key" placeholder="Key" size="small" style="flex: 1" />
      <n-input v-model:value="item.value" placeholder="Value" size="small" style="flex: 1" />
      <n-button size="small" type="error" @click="removeItem(index)"> 删除 </n-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const items = ref(props.modelValue);

watch(
  items,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { deep: true },
);

const addItem = () => {
  items.value.push({ key: "", value: "" });
};

const removeItem = (index) => {
  items.value.splice(index, 1);
};
</script>

<style scoped>
.key-value-editor {
  width: 100%;
}

.row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}
</style>
