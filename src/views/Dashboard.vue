<script setup lang="ts">
import Select from "primevue/select";
import Button from "primevue/button";
import { ref } from "vue";
import CreateInvoiceModal from "../components/CreateInvoiceModal.vue";
import InvoiceList from "../components/InvoiceList.vue";

const selectedStatus = ref();
const statuses = ref([
  { status: "Draft", value: "draft" },
  { status: "Pending", value: "pending" },
  { status: "Paid", value: "paid" },
  { status: "Clear filter", value: "clear" },
]);

const toggleFilterMenu = (e: any) => {
  console.log(e.value.value);
  console.log(e);
};
</script>
<template>
  <div>
    <div class="flex justify-between items-center flex-wrap lg:my-10 gap-4">
      <h1 class="text-2xl lg:text-4xl text-primary-5 dark:text-secondary-1">
        Invoices
      </h1>

      <div class="flex items-center gap-2 flex-wrap">
        <!-- create invoice modal -->
        <CreateInvoiceModal />
        <Select
          v-model="selectedStatus"
          :options="statuses"
          optionLabel="status"
          placeholder="Filter by status"
          class="w-full md:w-56"
          checkmark
          :highlightOnSelect="true"
          :pt="{
            root: {
              class: 'bottom-0 h-10 justify-center items-center',
            },
            listContainer: {
              class:
                'p-4 bg-primary-5 dark:bg-secondary-1 rounded-md max-h-none',
            },
            list: { class: 'text-base' },
            option: {
              class:
                'hover:!text-primary-5 !text-secondary-1 p-2 dark:hover:bg-secondary-1 dark:!text-primary-5 ',
            },
          }"
          @change="toggleFilterMenu"
        />
      </div>
    </div>
    <InvoiceList />
  </div>
</template>

<style scoped>
:deep(.p-select-list-container) {
  @apply p-4 bg-primary-5 dark:bg-secondary-1 rounded-md max-h-none;
}
</style>
