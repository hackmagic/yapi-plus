<template>
  <n-select
    v-model:value="selectedValue"
    :options="variableOptions"
    placeholder="选择变量"
    @update:value="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  variables: { type: Array, default: () => [] }
})

const emit = defineEmits(['select'])

const selectedValue = ref(null)

const variableOptions = ref(
  props.variables.map(v => ({ label: v.name, value: v.value }))
)

const handleSelect = (value) => {
  emit('select', value)
}
</script>
