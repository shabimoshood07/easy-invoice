<script setup lang="ts">
import Select from "primevue/select";
import { onMounted, ref } from "vue";
import InvoiceList from "../components/InvoiceList.vue";
import {
  useCreateInvoiceModalStore,
  useInvoiceStore,
  useUserStore,
} from "../store/store";
import { storeToRefs } from "pinia";

// Invoice store
const invoiceStore = useInvoiceStore();
const { invoices, isLoadingInvoices, invoiceItems } = storeToRefs(invoiceStore);
const { getAllInvoices, filterInvoice } = invoiceStore;

// Invoice modal store
const invoiceModalStore = useCreateInvoiceModalStore();
const { editedInvoice, invoiceModalVisible } = storeToRefs(invoiceModalStore);
// user store
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

onMounted(() => {
  getAllInvoices(user.value!.uid);
});

const handleClick = () => {
  editedInvoice.value = null;
  invoiceItems.value = [];
  invoiceModalVisible.value = true;
};

const selectedStatus = ref();
const statuses = ref([
  { status: "Pending", value: "invoicePending" },
  { status: "Paid", value: "invoicePaid" },
  { status: "Clear filter", value: "reset" },
]);
</script>
<template>
  <div>
    <div class="flex justify-between items-center flex-wrap lg:my-10 gap-4">
      <h1 class="text-2xl lg:text-4xl text-primary-5 dark:text-secondary-1">
        Invoices
      </h1>
      <div class="flex items-center gap-2 flex-wrap">
        <Button
          icon="pi pi-plus"
          label="Create invoice"
          iconPos="right"
          @click="handleClick"
          class="primary-btn text-base font-semibold"
        />
        <Select
          v-model="selectedStatus"
          :options="statuses"
          optionLabel="status"
          placeholder="Filter by status"
          class="w-full md:w-56"
          checkmark
          v-on:change="
            (e) => {
              if (e.value.value === 'reset') {
                return getAllInvoices(user!.uid);
              }
              filterInvoice({ status: e.value.value, user: user!.uid });
            }
          "
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
        />
      </div>
    </div>
    <InvoiceList :invoices="invoices" :isLoadingInvoices="isLoadingInvoices" />
  </div>
</template>

<style scoped>
:deep(.p-select-list-container) {
  @apply p-4 bg-primary-5 dark:bg-secondary-1 rounded-md max-h-none;
}
</style>
