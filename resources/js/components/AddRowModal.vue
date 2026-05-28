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
              ref="keyNameInput"
              v-model="keyName"
              :placeholder="__('Key of new translation')"
              class="w-full form-control form-input form-control-bordered"
          />
        </div>
      </div>
      <div class="bg-gray-100 dark:bg-gray-900 px-6 py-3 flex">
        <div class="flex items-center ml-auto space-x-3">
          <Button
              variant="ghost"
              type="button"
              dusk="cancel-create-button"
              :label="__('Cancel')"
              @click="$emit('create-cancelled')"
          />

          <Button
              type="submit"
              dusk="create-button"
              :label="__('Create')"
          />
        </div>
      </div>
    </form>
  </Modal>
</template>

<script>
import { Button } from 'laravel-nova-ui'

export default {
  name: "AddRowModal",
  components: { Button },
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
