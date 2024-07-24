<script setup lang="ts"></script>
<template>
  <div>
    <RouterLink to="/">
      <div class="flex flex-col justify-center items-center gap-0 relative">
        <img src="/src/assets/logo.svg" alt="logo" class="h-12 w-12 lg:h-16 lg:w-16" />
        <p
          class="text-lg italic font-semibold text-primary-5 dark:text-secondary-1 hidden md:block capitalize absolute -bottom-3"
        >
          EasyInvoice
        </p>
      </div>
    </RouterLink>
  </div>
</template>
<style scoped></style>
