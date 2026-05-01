<template>
  <div class="header-editor">
    <div class="header-table">
      <div class="header-header">
        <n-checkbox v-model:checked="allEnabled" @update:checked="handleToggleAll">
          启用
        </n-checkbox>
        <span class="header-key">Key</span>
        <span class="header-value">Value</span>
        <span class="header-action">操作</span>
      </div>

      <div class="header-body">
        <div
          v-for="(header, index) in headerList"
          :key="index"
          class="header-row"
          :class="{ disabled: !header.enabled }"
        >
          <n-checkbox v-model:checked="header.enabled" size="small" />
          <n-input
            v-model:value="header.key"
            placeholder="Header Key"
            size="small"
            class="header-key-input"
          />
          <n-input
            v-model:value="header.value"
            placeholder="Header Value"
            size="small"
            class="header-value-input"
          />
          <n-button text type="error" size="small" @click="removeHeader(index)">
            <template #icon>
              <n-icon><CloseOutline /></n-icon>
            </template>
          </n-button>
        </div>
      </div>

      <div class="header-footer">
        <n-button size="small" dashed @click="addHeader">
          <template #icon>
            <n-icon><AddOutline /></n-icon>
          </template>
          添加 Header
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { NCheckbox, NInput, NButton, NIcon } from "naive-ui";
import { CloseOutline, AddOutline } from "@vicons/ionicons5";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const headerList = ref([]);

const initHeaders = () => {
  if (props.modelValue && Array.isArray(props.modelValue)) {
    headerList.value = props.modelValue.map((h) => ({
      key: h.key || "",
      value: h.value || "",
      enabled: h.enabled !== false,
    }));
  } else {
    headerList.value = [];
  }
};

initHeaders();

watch(
  () => props.modelValue,
  () => {
    initHeaders();
  },
  { deep: true },
);

const allEnabled = computed({
  get: () => headerList.value.every((h) => h.enabled),
  set: (val) => {
    headerList.value.forEach((h) => (h.enabled = val));
    emitChange();
  },
});

const emitChange = () => {
  emit(
    "update:modelValue",
    headerList.value.map((h) => ({
      key: h.key,
      value: h.value,
      enabled: h.enabled,
    })),
  );
  emit("change", headerList.value);
};

const handleToggleAll = (checked) => {
  headerList.value.forEach((h) => (h.enabled = checked));
  emitChange();
};

const addHeader = () => {
  headerList.value.push({ key: "", value: "", enabled: true });
  emitChange();
};

const removeHeader = (index) => {
  headerList.value.splice(index, 1);
  emitChange();
};
</script>

<style scoped lang="scss">
.header-editor {
  width: 100%;

  .header-table {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: hidden;

    .header-header {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: #f5f5f5;
      border-bottom: 1px solid #e8e8e8;

      .header-key {
        flex: 1;
        margin-left: 8px;
        font-weight: 500;
      }

      .header-value {
        flex: 1;
        font-weight: 500;
      }

      .header-action {
        width: 50px;
        text-align: center;
      }
    }

    .header-body {
      .header-row {
        display: flex;
        align-items: center;
        padding: 4px 12px;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        &.disabled {
          opacity: 0.5;
        }

        .header-key-input {
          flex: 1;
          margin-left: 8px;
        }

        .header-value-input {
          flex: 1;
          margin-left: 8px;
        }
      }
    }

    .header-footer {
      padding: 8px 12px;
      border-top: 1px solid #e8e8e8;
    }
  }
}
</style>
