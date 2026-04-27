<template>
  <div class="err-msg">
    <n-alert :type="type" :title="title" closable>
      <slot>{{ message }}</slot>
    </n-alert>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'error' // error, warning, info, success
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.err-msg {
  margin: 16px 0;
}
</style>
