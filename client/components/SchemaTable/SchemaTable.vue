<template>
  <div class="schema-table">
    <n-data-table
      :columns="columns"
      :data="schemaData"
      :pagination="false"
      size="small"
      :bordered="false"
    />
  </div>
</template>

<script setup>
import { computed, h } from "vue";
import { NTag } from "naive-ui";

const props = defineProps({
  schema: {
    type: Object,
    default: () => ({}),
  },
});

const typeMap = {
  string: "info",
  number: "success",
  boolean: "warning",
  object: "error",
  array: "default",
};

const columns = [
  {
    title: "字段名",
    key: "name",
    width: 200,
  },
  {
    title: "类型",
    key: "type",
    width: 100,
    render: (row) =>
      h(
        NTag,
        { type: typeMap[row.type] || "default", size: "small" },
        {
          default: () => row.type,
        },
      ),
  },
  {
    title: "必填",
    key: "required",
    width: 60,
    render: (row) => (row.required ? "是" : "否"),
  },
  {
    title: "默认值",
    key: "default",
    width: 120,
  },
  {
    title: "描述",
    key: "description",
  },
];

const schemaData = computed(() => {
  if (!props.schema || !props.schema.properties) return [];

  const required = props.schema.required || [];

  return Object.entries(props.schema.properties).map(([name, prop]) => ({
    name,
    type: prop.type || "string",
    required: required.includes(name),
    default: prop.default || "-",
    description: prop.description || "-",
  }));
});
</script>

<style scoped>
.schema-table {
  width: 100%;
}
</style>
