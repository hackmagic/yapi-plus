<template>
  <div class="easy-drag-sort">
    <draggable v-model="list" item-key="id" handle=".drag-handle" @end="handleEnd">
      <template #item="{ element, index }">
        <div class="drag-item">
          <span class="drag-handle">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path
                d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
              />
            </svg>
          </span>
          <slot :element="element" :index="index" />
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import draggable from "vuedraggable";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "change"]);

const list = ref(props.modelValue);

watch(
  list,
  (newVal) => {
    emit("update:modelValue", newVal);
  },
  { deep: true },
);

const handleEnd = () => {
  emit("change", list.value);
};
</script>

<style scoped>
.easy-drag-sort {
  width: 100%;
}

.drag-item {
  display: flex;
  align-items: center;
  padding: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.drag-handle {
  cursor: move;
  margin-right: 8px;
  color: #999;
  display: flex;
  align-items: center;
}

.drag-handle:hover {
  color: #666;
}
</style>
