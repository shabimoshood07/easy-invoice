<script setup lang="ts">
import DataTable from "primevue/datatable";
import Loading from "./common/Loading.vue";
import { RouterLink } from "vue-router";
import { formatFirestoreTimestamp } from "../utils";
import { useCreateInvoiceModalStore } from "../store/store";
import { storeToRefs } from "pinia";

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
  <div
    v-if="props.isLoadingInvoices"
    class="flex justify-center items-center min-h-[60vh]"
  >
    <Loading />
  </div>
  <div v-else class="my-10">
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
      <!-- <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              placeholder="Search..."
              class="h-10 text-base border-2"
            />
          </IconField>
        </div>
      </template> -->

      <!-- <Column
        selectionMode="multiple"
        style="width: 3rem"
        :exportable="false"
      ></Column> -->

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
          <p v-if="slotProps.data.invoicePending">Pending</p>
          <p v-if="slotProps.data.invoiceDraft">Draft</p>
          <p v-if="slotProps.data.invoicePaid">Paid</p>
        </template>
      </Column>

      <!-- <Column field="rating" header="Reviews" sortable style="min-width: 12rem">
        <template #body="slotProps">
          <Rating :modelValue="slotProps.data.rating" :readonly="true" />
        </template>
      </Column> -->
      <!-- 
      <Column
        field="inventoryStatus"
        header="Status"
        sortable
        style="min-width: 12rem"
      >
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.inventoryStatus"
            :severity="getStatusLabel(slotProps.data.inventoryStatus)"
          />
        </template>
      </Column> -->

      <Column :exportable="false" style="min-width: 12rem">
        <template #body="slotProps">
          <!-- @click="editProduct(slotProps.data)" -->
          <Button
            icon="pi pi-pencil"
            outlined
            rounded
            class="text-yellow-500"
            @click="handleEditClick(slotProps.data)"
          />
          <!-- @click="confirmDeleteProduct(slotProps.data)" -->
          <Button
            icon="pi pi-trash"
            class="text-red-500"
            outlined
            rounded
            severity="danger"
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
</template>

<style scoped>
.table-cell-header {
  @apply hover:bg-primary-3;
}
</style>
