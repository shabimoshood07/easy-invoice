<script setup lang="ts">
import LogoComponent from "./LogoComponent.vue";
import ThemeSwitch from "./ThemeSwitch.vue";
</script>
<template>
  <header class="relative w-full ">
    <div
      class="flex justify-between items-center p-4 2xl:px-0 max-w-[1550px] mx-auto"
    >
      <LogoComponent />
      <ThemeSwitch />
    </div>
  </header>
</template>

<style scoped></style>
