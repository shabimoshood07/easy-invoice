<script setup lang="ts">
import Button from "primevue/button";
import LogoComponent from "./LogoComponent.vue";
import ThemeSwitch from "./ThemeSwitch.vue";
import { useUserStore } from "../store/store";
import { storeToRefs } from "pinia";
import Avatar from "primevue/avatar";
import SplitButton from "primevue/splitbutton";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const { handleSignOut } = userStore;
const { user, isLoggedIn } = storeToRefs(userStore);

const items = [
  {
    label: "Dashboard",
    icon: "pi pi-user",
    command: () => {
      router.push({ name: "Dashboard" });
    },
  },
  {
    label: "Setting",
    icon: "pi pi-cog",
    command: () => {
      router.push({ name: "Setting" });
    },
  },
  {
    label: "Logout",
    icon: "pi pi-sign-out",
    command: () => {
      handleSignOut();
    },
  },
];
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
        <div class="flex justify-center gap-10" v-if="isLoggedIn">
          <SplitButton
            :model="items"
            :pt="{
              root: {
                class: 'bg-primary-5 dark:bg-secondary-1 cursor-default',
              },
            }"
          >
            <span
              class="flex items-center font-bold px-3 py-1 rounded-md cursor-default"
            >
              <Avatar
                :label="
                  user?.email?.slice(0, 2) ?? user?.displayName?.slice(0, 2)
                "
                class="mr-2 uppercase font-bold dark:bg-primary-3 dark:text-secondary-1"
                size="normal"
                shape="circle"
              />
              <p class="text-secondary-1 dark:text-primary-5 hidden lg:block text-sm font-light">
                {{ user?.email }}
              </p>
            </span>
          </SplitButton>
        </div>
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
