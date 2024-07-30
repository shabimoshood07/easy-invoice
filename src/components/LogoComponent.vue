<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ className?: string }>();

const imgClass = computed(() => {
  return `${props.className} h-12 w-12 lg:h-16 lg:w-16`;
});
</script>
<template>  
  <div>
      <div class="flex flex-col justify-center items-center gap-0 relative">
        <img src="/src/assets/logo.svg" alt="logo" :class="imgClass" />
        <p
          class="text-lg italic font-semibold text-primary-5 dark:text-secondary-1 hidden md:block capitalize absolute -bottom-3"
        >
          EasyInvoice
        </p>
      </div>
  </div>
</template>
<style scoped></style>
