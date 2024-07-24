<script setup lang="ts">
import Select from "primevue/select";
import Button from "primevue/button";
import { ref } from "vue";

const selectedStatus = ref();
const statuses = ref([
  { status: "Draft", value: "draft" },
  { status: "Pending", value: "pending" },
  { status: "Paid", value: "paid" },
  { status: "Clear filter", value: "clear" },
]);
</script>
<template>
  <div class="flex justify-between items-center">
    <h1 class="text-2xl text-primary-5 dark:text-secondary-1">Invoices</h1>

    <div class="flex items-center gap-2">
      <Button
        icon="pi pi-plus"
        label="Create invoice"
        iconPos="right"
        prefix="bt"
      />

      <Select
        v-model="selectedStatus"
        :options="statuses"
        optionLabel="status"
        option-value="value"
        placeholder="Filter by status"
        class="w-full md:w-56"
        checkmark
        :highlightOnSelect="true"
        :pt="{
          listContainer: {
            class: 'p-4 bg-primary-5 dark:bg-secondary-1 rounded-md max-h-none',
          },
          list: { class: 'text-base' },
          option: {
            class:
              'hover:!text-primary-5 !text-secondary-1 p-2   dark:hover:bg-secondary-1 dark:!text-primary-5 aria-[selected=true]:text-primary-5',
          },
        }"
      />
    </div>
  </div>
</template>

<style scoped>
/* .p-select {
  @apply text-lg h-10 flex justify-between items-center p-2;
  .p-select-label {
    @apply text-4xl;
  }
} */

.p-button-icon {
  @apply text-red-600;
}
</style>
