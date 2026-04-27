<template>
  <div class="ace-editor-wrapper">
    <div :id="editorId" :style="{ height: height, width: '100%' }"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'json' // json, javascript, html, css, etc.
  },
  theme: {
    type: String,
    default: 'monokai'
  },
  height: {
    type: String,
    default: '300px'
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const editorId = ref(`ace-editor-${Math.random().toString(36).substr(2, 9)}`)
let editor = null

onMounted(async () => {
  const ace = await import('ace-builds')
  await import('ace-builds/src-noconflict/mode-json')
  await import('ace-builds/src-noconflict/mode-javascript')
  await import('ace-builds/src-noconflict/theme-monokai')
  await import('ace-builds/src-noconflict/ext-language_tools')

  editor = ace.edit(editorId.value)
  editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    readOnly: props.readOnly
  })
  
  editor.session.setMode(`ace/mode/${props.mode}`)
  editor.setTheme(`ace/theme/${props.theme}`)
  editor.setValue(props.modelValue, -1)
  
  editor.on('change', () => {
    emit('update:modelValue', editor.getValue())
  })
})

onBeforeUnmount(() => {
  if (editor) {
    editor.destroy()
  }
})

watch(() => props.modelValue, (newVal) => {
  if (editor && editor.getValue() !== newVal) {
    editor.setValue(newVal, -1)
  }
})
</script>

<style scoped>
.ace-editor-wrapper {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}
</style>
