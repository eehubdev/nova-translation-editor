<template>
  <button
      :type="type"
      :disabled="loading"
      class="nte-btn"
      :class="variant === 'link' ? 'nte-btn-link' : 'nte-btn-primary'"
  >
    <span v-if="loading" class="nte-spinner"></span>
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    type: {
      type: String,
      default: 'button',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
