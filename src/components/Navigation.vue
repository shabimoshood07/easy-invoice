<script setup lang="ts">
import Button from "primevue/button";
import LogoComponent from "./LogoComponent.vue";
import ThemeSwitch from "./ThemeSwitch.vue";
import { useUserStore } from "../store/store";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { handleSignOut } = userStore;
const { isLoggedIn } = storeToRefs(userStore);
</script>

<template>
  <header class="relative w-full">
    <div
      class="flex justify-between items-center p-4 2xl:px-0 max-w-[1550px] mx-auto"
    >
      <RouterLink to="/">
        <LogoComponent />
      </RouterLink>
      <div class="flex gap-4">
        <Button
          v-if="isLoggedIn"
          label="Logout"
          class="warning-btn w-[150px]"
          @click="handleSignOut"
        />
        <Button
          v-else
          label="Login"
          class="primary-btn w-[150px]"
          as="router-link"
          to="/login"
        />
        <ThemeSwitch />
      </div>
    </div>
  </header>
</template>

<style scoped></style>
