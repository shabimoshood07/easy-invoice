<script setup lang="ts">
import CreateInvoiceModal from "./components/CreateInvoiceModal.vue";
import Navigation from "./components/Navigation.vue";
import Toast from "primevue/toast";
</script>
<template>
  <div>
    <Navigation />
    <div class="w-full max-w-[1550px] mx-auto p-4 2xl:p-0">
      <RouterView />
    </div>
    <Toast position="top-left" />
    <CreateInvoiceModal />
  </div>
</template>

<style scoped></style>
