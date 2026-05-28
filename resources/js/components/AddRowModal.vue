<template>
  <Modal :show="true" @close="$emit('close')">
    <form autocomplete="off" class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden" @submit.prevent="handleSubmit">
      <div>
        <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 py-4 px-6">
          {{ __('Create') }} "{{ group }}"
        </h2>

        <div class="p-6">
          <label class="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 leading-tight">{{ __('Key of new translation') }}</label>
          <input
              type="text"
              ref="keyNameInput"
              required
              v-model="keyName"
              class="nte-input"
          >
        </div>
      </div>
      <div class="bg-gray-100 dark:bg-gray-900 px-6 py-3 flex">
        <div class="flex items-center ml-auto space-x-3">
          <ActionButton
              variant="link"
              tabindex="0"
              dusk="cancel-create-button"
              type="button"
              @click="$emit('create-cancelled')"
          >
            {{ __('Cancel') }}
          </ActionButton>

          <ActionButton type="submit">
            {{ __('Create') }}
          </ActionButton>
        </div>
      </div>
    </form>
  </Modal>
</template>

<script>
import ActionButton from './ActionButton.vue'

export default {
  name: "AddRowModal",
  components: { ActionButton },
  props: {
    group: {},
    existingKeys: {}
  },
  data() {
    return {
      keyName: ''
    }
  },
  methods: {
    handleSubmit() {
      this.keyName = this.keyName.trim();
      if(this.existingKeys.indexOf(this.keyName) != -1) {
        Nova.error('This key is already in use');
      }
      else {
        this.$emit('create', this.keyName)
      }
    },
  },
  mounted() {
    //this.$refs.keyNameInput.focus()
  },
}
</script>

<style scoped>
</style>
