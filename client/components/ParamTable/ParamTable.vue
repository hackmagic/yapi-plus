<template>
  <div class="param-table">
    <div class="table-header">
      <n-button type="primary" size="small" @click="addParam">
        添加参数
      </n-button>
    </div>
    
    <n-data-table
      :columns="columns"
      :data="params"
      :pagination="false"
      size="small"
    />
  </div>
</template>

<script setup>
import { ref, h, watch } from 'vue'
import { NInput, NSelect, NCheckbox, NButton } from 'naive-ui'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const params = ref([...props.modelValue])

watch(() => props.modelValue, (newVal) => {
  params.value = [...newVal]
}, { deep: true })

const updateParam = (index, key, value) => {
  params.value[index][key] = value
  emit('update:modelValue', [...params.value])
  emit('change', [...params.value])
}

const typeOptions = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Object', value: 'object' },
  { label: 'Array', value: 'array' }
]

const columns = [
  {
    title: '参数名',
    key: 'name',
    render: (row, index) => h(NInput, {
      value: row.name,
      placeholder: '参数名',
      'onUpdate:value': (val) => updateParam(index, 'name', val)
    })
  },
  {
    title: '类型',
    key: 'type',
    width: 120,
    render: (row, index) => h(NSelect, {
      value: row.type || 'string',
      options: typeOptions,
      'onUpdate:value': (val) => updateParam(index, 'type', val)
    })
  },
  {
    title: '必填',
    key: 'required',
    width: 80,
    render: (row, index) => h(NCheckbox, {
      checked: row.required === '1' || row.required === true,
      'onUpdate:checked': (val) => updateParam(index, 'required', val ? '1' : '0')
    })
  },
  {
    title: '描述',
    key: 'desc',
    render: (row, index) => h(NInput, {
      value: row.desc,
      placeholder: '描述',
      'onUpdate:value': (val) => updateParam(index, 'desc', val)
    })
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    render: (row, index) => h(NButton, {
      type: 'error',
      size: 'small',
      ghost: true,
      onClick: () => removeParam(index)
    }, { default: () => '删除' })
  }
]

const addParam = () => {
  params.value.push({
    name: '',
    type: 'string',
    required: '0',
    desc: ''
  })
  emit('update:modelValue', [...params.value])
  emit('change', [...params.value])
}

const removeParam = (index) => {
  params.value.splice(index, 1)
  emit('update:modelValue', [...params.value])
  emit('change', [...params.value])
}
</script>

<style scoped>
.table-header {
  margin-bottom: 8px;
}
</style>
