<script setup lang="ts">
import InputText from "primevue/inputtext";
import { useField } from "vee-validate";
import { useAttrs } from "vue";
const $attrs = useAttrs();
const props = defineProps({
  name: { type: String, required: true },
  type: String,
  label: { type: String, required: true },
});
const { value, errorMessage } = useField(() => props.name);
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <label
      :for="label"
      class="text-primary-5 dark:text-secondary-1 capitalize font-medium"
      >{{ label }}</label
    >
    <InputText
      v-model="value"
      :type="type || 'text'"
      :autocomplete="true"
      class="border-2 h-10 text-base font-medium p-1 text-primary-5 dark:bg-primary-1 bg-secondary-1"
      :v-bind="$attrs"
    />
    <span v-if="errorMessage" class="text-red-400 text-sm">{{
      errorMessage
    }}</span>
  </div>
</template>

<style scoped></style>
