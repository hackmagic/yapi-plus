<template>
  <div class="guide-btns">
    <n-space>
      <n-button
        v-if="showPrev"
        @click="$emit('prev')"
      >
        上一步
      </n-button>
      <n-button
        v-if="showNext"
        type="primary"
        @click="$emit('next')"
      >
        下一步
      </n-button>
      <n-button
        v-if="showFinish"
        type="success"
        @click="$emit('finish')"
      >
        完成
      </n-button>
    </n-space>
  </div>
</template>

<script setup>
defineProps({
  showPrev: {
    type: Boolean,
    default: true
  },
  showNext: {
    type: Boolean,
    default: true
  },
  showFinish: {
    type: Boolean,
    default: false
  }
})

defineEmits(['prev', 'next', 'finish'])
</script>

<style scoped>
.guide-btns {
  padding: 16px 0;
  display: flex;
  justify-content: center;
}
</style>
