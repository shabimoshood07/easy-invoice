<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { VsxIcon } from "vue-iconsax";
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>
<template>
  <div>
    <button @click="toggleDark()">
      <VsxIcon
        iconName="Sun1"
        :size="32"
        class="text-secondary-1"
        type="bold"
        v-if="isDark"
      />
      <VsxIcon
        v-else
        iconName="Moon"
        :size="32"
        class="text-primary-5"
        type="bold"
      />
    </button>
  </div>
</template>

<style scoped></style>
