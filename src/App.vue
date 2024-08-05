<script setup lang="ts">
import { onMounted } from "vue";
import CreateInvoiceModal from "./components/CreateInvoiceModal.vue";
import Navigation from "./components/Navigation.vue";
import Toast from "primevue/toast";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "./store/store";
import { useRouter } from "vue-router";
const userStore = useUserStore();
const { handleLogin } = userStore;
const router = useRouter();
onMounted(() => {
  let auth;
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      handleLogin(user);
    } else {
      router.push({ name: "Home" });
    }
  });
});
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
