<template>
  <n-modal
    v-model:show="visible"
    preset="dialog"
    title="确认离开"
    :content="message"
    positive-text="确定"
    negative-text="取消"
    @positive-click="handleYes"
    @negative-click="handleNo"
    @close="handleNo"
  />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  message: {
    type: String,
    default: "你确定要离开当前页面吗？未保存的更改可能会丢失。",
  },
  visible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["confirm", "cancel"]);

const visible = ref(props.visible);

watch(
  () => props.visible,
  (val) => {
    visible.value = val;
  }
);

const handleYes = () => {
  emit("confirm", true);
};

const handleNo = () => {
  emit("cancel", false);
};
</script>

<style scoped>
/* 组件样式 */
</style>
