<script setup lang="ts">
import DataTable from "primevue/datatable";
import Loading from "./common/Loading.vue";
import { RouterLink } from "vue-router";
import { formatFirestoreTimestamp } from "../utils";
import { useCreateInvoiceModalStore } from "../store/store";
import { storeToRefs } from "pinia";
import Button from "primevue/button";

interface IProps {
  invoices: InvoiceType[];
  isLoadingInvoices: boolean;
}
const props = defineProps<IProps>();
const invoiceModalStore = useCreateInvoiceModalStore();
const { editedInvoice } = storeToRefs(invoiceModalStore);
const { toggleInvoiceModalVisible } = invoiceModalStore;

const handleEditClick = (invoice: InvoiceType) => {
  editedInvoice.value = invoice;
  toggleInvoiceModalVisible();
};
</script>
<template>
  <!-- Loading -->
  <div
    v-if="props.isLoadingInvoices"
    class="flex justify-center items-center min-h-[60vh]"
  >
    <Loading />
  </div>
  <!-- invoice list -->
  <div v-if="props.invoices && !props.isLoadingInvoices" class="my-10">
    <DataTable
      unstyled
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} invoices"
      :paginator="true"
      :value="invoices"
      :rows="10"
      dataKey="invoiceList"
      :pt="{
        table: {
          class: 'w-full',
        },
        thead: {
          class: 'bg-primary-1 dark:bg-primary-4 dark:text-secondary-1',
        },
        tbody: {
          class: 'bg-secondary-2 dark:bg-primary-3 dark:text-secondary-1',
        },
        paginator: {
          class: 'border-4 bg-red-500',
        },
        footer: {
          class: 'border-4 bg-red-500',
        },
        paginatorContainer: {
          class: 'border-4 !bg-red-500',
        },
      }"
    >
      <template #empty>
        <div
          class="w-full flex justify-center flex-col items-center p-14 gap-6"
        >
          <h1 class="dark:text-secondary-1 text-primary-5 text-3xl">
            No Invoices found
          </h1>
          <h1 class="dark:text-secondary-1 text-primary-5 text-xl italic">
            Invoices created will appear here
          </h1>
        </div>
      </template>
      <Column
        field="invoiceId"
        header="Invoice No"
        sortable
        style="min-width: 10rem"
        frozen
        :pt="{
          headerCell: {
            class:
              'text-left p-4 hover:bg-secondary-2 dark:hover:bg-primary-3 cursor-pointer duration-500 items-center',
          },
          bodyCell: {
            class: 'text-lg  p-4 text-left',
          },
          columnHeaderContent: {
            class: 'flex gap-2 items-center',
          },
        }"
      >
        <template #body="slotProps"> #{{ slotProps.data.invoiceId }} </template>
      </Column>

      <Column
        field="paymentDueDate"
        header="Due date"
        sortable
        style="min-width: 10rem"
        :pt="{
          headerCell: {
            class:
              'text-left p-4 hover:bg-secondary-2 dark:hover:bg-primary-3 cursor-pointer duration-500',
          },
          bodyCell: {
            class: '!text-lg  p-4 text-left',
          },
          columnHeaderContent: {
            class: 'flex gap-2 items-center',
          },
        }"
      >
        <template #body="slotProps">
          <p v-if="slotProps.data.paymentDueDate">
            {{ formatFirestoreTimestamp(slotProps.data.paymentDueDate) }}
          </p>
        </template>
      </Column>
      <Column
        field="clientName"
        header="Client name"
        sortable
        style="min-width: 12rem; text-transform: capitalize"
        :pt="{
          headerCell: {
            class:
              'text-left p-4 hover:bg-secondary-2 dark:hover:bg-primary-3 cursor-pointer duration-500',
          },
          bodyCell: {
            class: '!text-lg  p-4 text-left',
          },
          columnHeaderContent: {
            class: 'flex gap-2 items-center',
          },
        }"
      ></Column>

      <Column
        field="invoiceTotal"
        header="Total"
        sortable
        style="min-width: 8rem"
        :pt="{
          headerCell: {
            class:
              'text-left p-4 hover:bg-secondary-2 dark:hover:bg-primary-3 cursor-pointer duration-500',
          },
          bodyCell: {
            class: '!text-lg  p-4 text-left',
          },
          columnHeaderContent: {
            class: 'flex gap-2 items-center',
          },
        }"
      >
        <template #body="slotProps">
          &#8358; {{ slotProps.data.invoiceTotal.toLocaleString() }}
        </template>
      </Column>

      <Column
        field="invoiceDate"
        header="Invoice date"
        sortable
        style="min-width: 10rem"
        :pt="{
          headerCell: {
            class:
              'text-left p-4 hover:bg-secondary-2 dark:hover:bg-primary-3 cursor-pointer duration-500',
          },
          bodyCell: {
            class: '!text-lg  p-4 text-left',
          },
          columnHeaderContent: {
            class: 'flex gap-2 items-center',
          },
        }"
      >
        <template #body="slotProps">
          {{ formatFirestoreTimestamp(slotProps.data.invoiceDate) }}
        </template>
      </Column>
      <Column
        field=""
        header="Status"
        sortable
        style="min-width: 10rem"
        :pt="{
          headerCell: {
            class:
              'text-left p-4 hover:bg-secondary-2 dark:hover:bg-primary-3 cursor-pointer duration-500',
          },
          bodyCell: {
            class: '!text-lg  p-4 text-left',
          },
          columnHeaderContent: {
            class: 'flex gap-2 items-center',
          },
        }"
      >
        <template #body="slotProps">
          <p
            v-if="slotProps.data.invoicePending"
            class="bg-red-400 text-secondary-1 text-base px-2 py-1 rounded-md flex gap-3 items-center justify-start w-[100px]"
          >
            <i class="pi pi-circle-fill text-[10px] text-red-900"></i>
            Pending
          </p>
          <p
            v-if="slotProps.data.invoicePaid"
            class="bg-green-600 text-base text-secondary-2 px-2 py-1 rounded-md flex gap-3 items-center justify-start w-[100px]"
          >
            <i class="pi pi-circle-fill text-[10px] text-green-900"></i>
            Paid
          </p>
          <p
            v-if="slotProps.data.invoiceDraft"
            class="bg-yello-600 text-base text-secondary-2 px-2 py-1 rounded-md flex gap-3 items-center justify-start w-[100px]"
          >
            <i class="pi pi-circle-fill text-[10px] text-yellow-900"></i>
            Draft
          </p>
        </template>
      </Column>

      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="text-yellow-500"
            @click="handleEditClick(slotProps.data)"
          />
          <RouterLink
            :to="{
              name: 'Invoice',
              params: { invoiceId: slotProps.data.invoiceId },
            }"
          >
            <Button icon="pi pi-eye" outlined rounded severity="danger" />
          </RouterLink>
        </template>
      </Column>
    </DataTable>
  </div>

  <!-- error -->
  <div
    v-if="!props.invoices && !props.isLoadingInvoices"
    class="w-full flex justify-center flex-col items-center p-14 gap-6 h-[40dvh]"
  >
    <i
      class="pi pi-file-word text-6xl dark:text-secondary-1 text-primary-5"
    ></i>
    <p class="dark:text-secondary-1 text-primary-5 text-3xl">
      Error Loading invoices!!
    </p>
    <Button
      label="Retry"
      :loading="props.isLoadingInvoices"
      :disabled="props.isLoadingInvoices"
    />
  </div>
</template>

<style scoped>
.table-cell-header {
  @apply hover:bg-primary-3;
}
</style>
