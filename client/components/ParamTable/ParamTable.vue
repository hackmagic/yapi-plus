<template>
  <div class="param-table">
    <n-button type="primary" size="small" @click="addParam" style="margin-bottom: 8px;">
      添加参数
    </n-button>
    
    <n-data-table
      :columns="columns"
      :data="params"
      :pagination="false"
      size="small"
    />
  </div>
</template>

<script setup>
import { ref, h } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const params = ref(props.modelValue)

const columns = [
  {
    title: '参数名',
    key: 'name',
    render: (row, index) => h('input', {
      class: 'n-input',
      value: row.name || '',
      onInput: (e) => updateParam(index, 'name', e.target.value)
    })
  },
  {
    title: '类型',
    key: 'type',
    width: 120,
    render: (row, index) => h('select', {
      class: 'n-select',
      value: row.type || 'string',
      onChange: (e) => updateParam(index, 'type', e.target.value)
    }, [
      h('option', { value: 'string' }, 'String'),
      h('option', { value: 'number' }, 'Number'),
      h('option', { value: 'boolean' }, 'Boolean'),
      h('option', { value: 'object' }, 'Object'),
      h('option', { value: 'array' }, 'Array')
    ])
  },
  {
    title: '必填',
    key: 'required',
    width: 80,
    render: (row, index) => h('input', {
      type: 'checkbox',
      checked: row.required || false,
      onChange: (e) => updateParam(index, 'required', e.target.checked)
    })
  },
  {
    title: '描述',
    key: 'desc',
    render: (row, index) => h('input', {
      class: 'n-input',
      value: row.desc || '',
      onInput: (e) => updateParam(index, 'desc', e.target.value)
    })
  },
  {
    title: '操作',
    key: 'actions',
    width: 80,
    render: (row, index) => h('button', {
      class: 'n-button n-button--error-type',
      onClick: () => removeParam(index)
    }, '删除')
  }
]

const addParam = () => {
  params.value.push({
    name: '',
    type: 'string',
    required: false,
    desc: ''
  })
  emit('update:modelValue', params.value)
}

const removeParam = (index) => {
  params.value.splice(index, 1)
  emit('update:modelValue', params.value)
}

const updateParam = (index, field, value) => {
  params.value[index][field] = value
  emit('update:modelValue', params.value)
}
</script>

<style scoped>
.param-table {
  width: 100%;
}

input, select {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

input[type="checkbox"] {
  width: auto;
}
</style>
