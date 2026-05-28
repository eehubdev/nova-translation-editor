<template>
  <div>
    <Heading class="mb-6">{{ title }}</Heading>

    <div class="flex border-b-2 border-gray-200 dark:border-gray-700">
      <div class="w-1/5 px-8 py-2">
        <label class="inline-block text-gray-600 dark:text-gray-300 pt-2 leading-tight">{{ __('Filter') }}</label>
      </div>
      <div class="w-4/5 py-2 px-8 relative">
            <span
                v-if="filterString"
                @click="filterString = ''"
                class="cursor-pointer text-primary-500 absolute clear-filter-icon"
                :title="__('Clear filter')">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </span>
        <input type="text"
               :placeholder="__('Filter') + ': By key or translation'"
               class="w-full form-control form-input form-control-bordered"
               v-model="filterString"/>
      </div>
    </div>

    <Card v-if="showTable" class="my-6 rounded-md mb-8">
      <nav
          class="flex flex-col md:flex-row md:items-center md:justify-center pt-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <a v-for="(translation, group) in filterdTranslations" :key="group"
           :class="currentGroup === group ? 'text-primary-500 border-primary-500' : ' text-gray-400 border-transparent'"
           class="no-underline border-b-2 uppercase tracking-wide font-bold text-sm py-3 mx-2 px-3 inline-block cursor-pointer"
           @click="currentGroup = group">
          {{ group }}&nbsp;({{ Object.keys(translation).length }})
        </a>
      </nav>
      <template v-for="(translation, group) in filterdTranslations">

        <div v-if="currentGroup === group" :key="group + 'tab'"
             class="overflow-x-auto">
          <table class="table w-full">
            <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th class="text-left px-2 whitespace-nowrap uppercase text-gray-500 text-xs tracking-wide py-2">Key</th>
              <th class="text-left px-2 whitespace-nowrap uppercase text-gray-500 text-xs tracking-wide py-2"
                  v-for="lang in languages">Translation&nbsp;{{ lang }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(trans, key) in translation">
              <td class="px-2 py-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap cursor-pointer dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-900">
                {{ key }}
                <p class="text-xs mt-2 text-gray-600 dark:text-gray-400">{{ group }}.{{ key }}</p>
              </td>
              <td class="px-2 py-2 border-t border-gray-100 dark:border-gray-700 whitespace-nowrap cursor-pointer dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-900"
                  v-for="lang in languages">
              <textarea class="nte-textarea" v-model="trans[lang]"
                        @input="translationChanged(group, key, lang, $event)"/>
              </td>
            </tr>
            </tbody>
          </table>

          <div class="flex flex-col md:flex-row justify-center space-y-2 md:space-y-0 space-x-3 mb-2">
            <Button
                dusk="create-button"
                type="button"
                variant="ghost"
                :label="__('Add new row')"
                @click="showNewModal = true"
            />

            <Button
                dusk="save-group-button"
                type="button"
                :loading="! loaded"
                :label="saveGroupLabel"
                @click="save(currentGroup)"
            />
          </div>
        </div>
      </template>
    </Card>

    <div
        class="flex flex-col md:flex-row md:items-center justify-center md:justify-end space-y-2 md:space-y-0 space-x-3"
        v-if="showTable"
    >
      <Button
          variant="ghost"
          type="button"
          :label="__('Cancel')"
          @click="reloadPage"
      />

      <Button
          dusk="create-all-button"
          type="button"
          :loading="!loaded"
          :label="__('Save all')"
          @click="save"
      />
    </div>

    <add-row-modal
        :group="currentGroup"
        :existing-keys="existingKeys"
        v-if="showNewModal"
        @close="showNewModal = false"
        @createCancelled="showNewModal = false"
        @create="addRow"
    />

    <div v-if="!showTable && loaded" class="toasted nova error">
      <p class="mb-2">You have not translation groups (aka translation file) activated in your
        `config/nova-translation-editor.php` config file.</p>
      <p>Please add at least one group to the `groups` array element (for example `auth`, `validation`, etc.).</p>
    </div>
  </div>
</template>

<script>
import AddRowModal from "./AddRowModal.vue";
import { Button } from 'laravel-nova-ui';

export default {
  components: {AddRowModal, Button},
  props: ['initialTranslations', 'languages', 'group'],
  data: () => {
    return {
      title: 'Nova Translation Editor',
      apiUrl: '/nova-vendor/nova-translation-editor/',
      changedTranslations: [],
      translations: [],
      currentGroup: null,
      showNewModal: false,
      loaded: false,
      useTabs: true,
      filterString: ''
    }
  },
  mounted() {
    this.loadData();
  },
  computed: {
    existingKeys() {
      return Object.keys(this.translations[this.currentGroup]);
    },
    saveGroupLabel() {
      return `${this.__('Save')} "${this.currentGroup}"`;
    },
    showTable() {
      return this.translations && Object.keys(this.translations).length > 0;
    },
    filterdTranslations() {
      let filtered = {};

      if(this.filterString) {
        for(let groupName in this.translations) {
          const group = this.translations[groupName];
          filtered[groupName] = {};

          for(let key in group) {
            for(let lang in group[key]) {
              const text = group[key][lang],
                reg = new RegExp(this.filterString, 'i');
              if(text.match(reg) || key.match(reg)) {
                filtered[groupName][key] = group[key];
              }
            }
          }
        }
      }
      else {
        filtered = this.translations;
      }

      return filtered;
    },
  },
  methods: {
    reloadPage() {
      window.location.reload();
    },

    loadData() {
      this.loaded = true;

      this.translations = this.initialTranslations;
      this.currentGroup = Object.keys(this.translations)[0];
    },

    search(value, key) {
      if(key && key.search(this.filterString) >= 0) {
        return value;
      }

      for(let lang in value) {
        const trans = value[lang];

        if(typeof trans === 'string') {
          if(trans.search(this.filterString) >= 0) {
            return value;
          }
        }
        else {
          return this.search(trans, lang);
        }
      }

      return null;
    },

    addRow(name) {
      let row = {};
      for(let i in this.languages) {
        row[this.languages[i]] = '';
      }

      this.translations[this.currentGroup][name] = row;
      this.showNewModal = false;
    },

    save(group) {
      this.loaded = false;
      let data = {};

      if(group && typeof group == "string") {
        data[group] = this.changedTranslations[group]
      }
      else {
        for(let i in this.changedTranslations) {
          data[i] = this.changedTranslations[i]
        }
      }

      Nova.request().post(this.apiUrl + 'save', {data: data}).then(response => {
        this.loaded = true;

        Nova.success('Saved')
      }).catch(error => {
        Nova.error(error)
      });
    },

    translationChanged(group, key, lang, event) {
        this.changedTranslations[group] = this.changedTranslations[group] || {};
        this.changedTranslations[group][key] = this.changedTranslations[group][key] || this.translations[group][key];
        this.changedTranslations[group][key][lang] = event.target.value;
    }
  }
}
</script>

<style scoped>
.clear-filter-icon {
  right: 2.5rem;
  top: 1rem;
}
textarea {
  min-width: 220px;
}
.whitespace-nowrap {
  white-space: nowrap;
}
</style>
