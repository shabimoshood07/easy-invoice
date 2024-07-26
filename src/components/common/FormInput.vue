<script setup lang="ts">
defineProps({
  modelValue: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String },
  aria: { type: String },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <label
      :for="label"
      class="text-primary-5 dark:text-secondary-1 capitalize font-medium"
      >{{ label }}</label
    >
    <InputText
      v-bind="$attrs"
      :id="label"
      :aria-describedby="aria"
      class="border-2 h-10 text-base font-medium p-1 text-primary-5 dark:bg-primary-1 bg-secondary-1"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <!-- required -->
    <small :id="aria" class="text-primary-5 dark:text-secondary-1">
      {{ description }}
    </small>
  </div>
</template>
