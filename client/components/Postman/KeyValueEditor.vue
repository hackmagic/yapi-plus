<template>
  <div class="key-value-editor">
    <div v-for="(item, index) in modelValue" :key="index" class="kv-row">
      <n-input
        :value="item.key"
        placeholder="Key"
        size="small"
        @update:value="(val) => updateKey(index, val)"
      />
      <n-input
        :value="item.value"
        placeholder="Value"
        size="small"
        @update:value="(val) => updateValue(index, val)"
      />
      <n-button text type="error" size="small" @click="removeItem(index)">
        <template #icon>
          <n-icon><TrashOutline /></n-icon>
        </template>
      </n-button>
    </div>
    <n-button size="small" @click="addItem" style="margin-top: 8px">
      <template #icon>
        <n-icon><AddOutline /></n-icon>
      </template>
      添加
    </n-button>
  </div>
</template>

<script setup>
import { AddOutline, TrashOutline } from "@vicons/ionicons5";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const addItem = () => {
  const newValue = [...props.modelValue, { key: "", value: "" }];
  emit("update:modelValue", newValue);
};

const removeItem = (index) => {
  const newValue = props.modelValue.filter((_, i) => i !== index);
  emit("update:modelValue", newValue);
};

const updateKey = (index, val) => {
  const newValue = props.modelValue.map((item, i) => {
    if (i === index) {
      return { ...item, key: val };
    }
    return item;
  });
  emit("update:modelValue", newValue);
};

const updateValue = (index, val) => {
  const newValue = props.modelValue.map((item, i) => {
    if (i === index) {
      return { ...item, value: val };
    }
    return item;
  });
  emit("update:modelValue", newValue);
};
</script>

<style scoped>
.key-value-editor {
  width: 100%;
}

.kv-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  align-items: center;
}

.kv-row .n-input {
  flex: 1;
}
</style>
