<template>
  <n-select v-model:value="methodValue" :options="methodOptions" size="small" />
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  modelValue: { type: String, default: "GET" },
});

const emit = defineEmits(["update:modelValue"]);

const methodValue = ref(props.modelValue);

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
  { label: "PATCH", value: "PATCH" },
  { label: "HEAD", value: "HEAD" },
  { label: "OPTIONS", value: "OPTIONS" },
];
</script>
