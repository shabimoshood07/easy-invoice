<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
<template>
  <div>
    <button @click="toggleDark()">
      <i
        v-if="isDark"
        class="pi pi-sun text-secondary-1"
        style="font-size: 2rem"
      ></i>
      <i v-else class="pi pi-moon text-primary-5" style="font-size: 2rem"></i>
    </button>
  </div>
</template>

<style scoped></style>
