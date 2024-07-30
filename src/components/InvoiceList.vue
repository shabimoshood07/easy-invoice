<script setup lang="ts">
import DataTable from "primevue/datatable";
import { CreateInvoiceFormDataType } from "../types";
import Loading from "./common/Loading.vue";
import { RouterLink } from "vue-router";
import { formatFirestoreTimestamp } from "../utils";
import CreateInvoiceModal from "./CreateInvoiceModal.vue";
import { ref } from "vue";
const visible = ref(false);

interface IProps {
  invoices: (CreateInvoiceFormDataType & { id: string })[];
  isLoadingInvoices: boolean;
}
const props = defineProps<IProps>();
console.log(props.invoices);
</script>
<template>
  <div
    v-if="props.isLoadingInvoices"
    class="flex justify-center items-center min-h-[60vh]"
  >
    <Loading />
  </div>
  <div v-else>
    <!-- v-model:selection="selectedProducts" -->
    <!-- :filters="filters" -->
    <DataTable
      ref="dt"
      :value="invoices"
      dataKey="id"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 25]"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <!-- v-model="filters['global'].value" -->
            <InputText
              placeholder="Search..."
              class="h-10 text-base border-2"
            />
          </IconField>
        </div>
      </template>

      <Column
        selectionMode="multiple"
        style="width: 3rem"
        :exportable="false"
      ></Column>

      <Column
        field="invoiceId"
        header="Invoice No"
        sortable
        style="min-width: 10rem"
      >
        <template #body="slotProps"> #{{ slotProps.data.invoiceId }} </template>
      </Column>

      <Column
        field="paymentDueDate"
        header="Due date"
        sortable
        style="min-width: 10rem"
      >
        <template #body="slotProps">
          <p v-if="slotProps.data.paymentDueDate">
            Due {{ formatFirestoreTimestamp(slotProps.data.paymentDueDate) }}
          </p>
        </template>
      </Column>
      <Column
        field="clientName"
        header="Client name"
        sortable
        style="min-width: 12rem; text-transform: capitalize"
      ></Column>

      <!-- <Column header="Image">
        <template #body="slotProps">
          <img
            :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`"
            :alt="slotProps.data.image"
            class="rounded"
            style="width: 64px"
          />
        </template>
      </Column> -->

      <Column
        field="invoiceTotal"
        header="Total"
        sortable
        style="min-width: 8rem"
      >
        <template #body="slotProps">
          &#8358; {{ slotProps.data.invoiceTotal }}
        </template>
      </Column>

      <Column
        field="invoiceDate"
        header="Invoice date"
        sortable
        style="min-width: 10rem"
      >
        <template #body="slotProps">
          {{ formatFirestoreTimestamp(slotProps.data.invoiceDate) }}
        </template>
      </Column>
      <Column field="" header="Status" sortable style="min-width: 10rem">
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
          <Button icon="pi pi-pencil" outlined rounded class="mr-2" />
          <!-- @click="confirmDeleteProduct(slotProps.data)" -->
          <Button icon="pi pi-trash" outlined rounded severity="danger" />
          <RouterLink
            :to="{
              name: 'Invoice details',
              params: { invoiceId: slotProps.data.id },
            }"
          >
            <Button icon="pi pi-eye" outlined rounded severity="danger" />
          </RouterLink>
        </template>
      </Column>
    </DataTable>
  </div>
  <!-- <CreateInvoiceModal /> -->
</template>

<style scoped></style>
