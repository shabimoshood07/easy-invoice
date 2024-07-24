<script setup lang="ts">
import Navigation from "./components/Navigation.vue";
</script>
<template>
  <div>
    <Navigation />
    <div class="w-full max-w-[1550px] mx-auto p-4 2xl:p-0">
      <RouterView />
    </div>
  </div>
</template>

<style scoped></style>
