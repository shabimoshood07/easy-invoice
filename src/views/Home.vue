<script setup lang="ts"></script>
<template>
  <div class="w-full max-w-[1550px] mx-auto">
    <div class="grid lg:grid-cols-2 my-9 p-4 2xl:p-0">
      <h1
        class="text-primary-5 dark:text-secondary-1 font-bold capitalize text-4xl lg:text-5xl !leading-loose  "
      >
        Welcome to <span class="italic text-6xl text-primary-2">EasyInvoice</span>
        <br class="leading-loose" />
        Your Go-To Invoice Generator
      </h1>
      <div class="bg-primary-2 dark:bg-secondary-1 flex justify-center items-center relative overflow-hidden rounded-md shadow-2xl min-h-[400px] ">
        <div class="absolute -top-8 -left-8 rounded-full bg-primary-5 dark:bg-primary-2 h-[200px] w-[200px]"/>
        <div class="absolute -bottom-8 -right-8 rounded-full bg-primary-5 dark:bg-primary-2 h-[200px] w-[200px]"/>
        <VsxIcon
          iconName="MoneyRecive"
          :size="120"
          class="text-primary-5 dark:text-primary-2"
          type="bold"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
