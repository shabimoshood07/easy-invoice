<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useCreateInvoiceModalStore, useInvoiceStore } from "../store/store";
import { onMounted, ref, toRef, watch } from "vue";
import Loading from "../components/common/Loading.vue";
import { storeToRefs } from "pinia";
import { formatFirestoreTimestamp } from "../utils";
const route = useRoute();
const router = useRouter();
const invoiceId = route.params.invoiceId as string;
const invoiceStore = useInvoiceStore();
const { getInvoice } = invoiceStore;
const { isLoadingInvoice } = storeToRefs(invoiceStore);
const invoiceModalStore = useCreateInvoiceModalStore();
const { editedInvoice } = storeToRefs(invoiceModalStore);
const { toggleInvoiceModalVisible } = invoiceModalStore;
const invoice = ref<InvoiceType | null>(null);
const error = ref<string | null>(null);

onMounted(async () => {
  const data = await getInvoice(invoiceId);
  if (data.error) return (error.value = data.error);
  invoice.value = data.invoices[0];
});

const handleEditClick = (invoice: InvoiceType) => {
  editedInvoice.value = invoice;
  toggleInvoiceModalVisible();
};
</script>
<template>
  <div class="my-8">
    <Button
      icon="pi pi-arrow-left"
      label="Back"
      iconPos="left"
      class="primary-btn w-[100px]"
      @click="router.go(-1)"
    />
    <!-- Loading state -->
    <div
      v-if="isLoadingInvoice"
      class="h-[50vh] flex justify-center items-center"
    >
      <Loading />
    </div>
    <!-- Details-->
    <div v-if="!isLoadingInvoice && invoice" class="space-y-4 my-10">
      <div
        class="bg-primary-1 dark:bg-primary-4 rounded-md w-full p-2 py-4 flex justify-between items-center flex-wrap gap-3"
      >
        <div class="flex gap-2 items-center">
          <h1 class="text-lg font-medium dark:text-secondary-1">Status</h1>
          <p
            v-if="invoice?.invoicePending"
            class="bg-red-400 text-secondary-1 p-2 rounded-md flex gap-3 items-center"
          >
            <i class="pi pi-circle-fill text-[8px]"></i>
            Pending
          </p>
          <p v-if="invoice?.invoicePaid">Paid</p>
          <p v-if="invoice?.invoiceDraft">Draft</p>
        </div>
        <div class="flex gap-2 flex-wrap">
          <Button
            label="Edit"
            class="primary-btn w-[100px]"
            @click="handleEditClick(invoice)"
          />
          <Button label="Mark as paid" class="primary-btn" />
          <Button label="Delete" class="warning-btn w-[100px]" />
        </div>
      </div>

      <div
        class="bg-primary-1 dark:bg-primary-4 rounded-md w-full p-4 lg:p-6 dark:text-secondary-1 text-primary-5 space-y-10"
      >
        <div class="flex justify-between flex-wrap w-full">
          <div>
            <h1 class="text-4xl uppercase font-semibold">
              #{{ invoice.invoiceId }}
            </h1>
            <p class="uppercase">{{ invoice.productDescription }}</p>
          </div>
          <div class="capitalize text-right">
            <p>{{ invoice.billerStreetAddress }}</p>
            <p>{{ invoice.billerCity }}</p>
            <p>{{ invoice.billerZipCode }}</p>
            <p>{{ invoice.billerCountry }}</p>
          </div>
        </div>

        <div class="flex justify-start gap-28">
          <div class="space-y-10">
            <div>
              <p class="heading">Invoice date</p>
              <p class="detail">
                {{ formatFirestoreTimestamp(invoice.invoiceDate) }}
              </p>
            </div>
            <div>
              <p class="heading">payment date</p>
              <p class="detail">
                {{ formatFirestoreTimestamp(invoice.paymentDueDate) }}
              </p>
            </div>
          </div>

          <div class="space-y-10">
            <div>
              <p class="heading">bill to</p>
              <p class="detail">{{ invoice.clientName }}</p>
            </div>
            <div class="capitalize text-left">
              <p>{{ invoice.clientStreetAddress }}</p>
              <p>{{ invoice.clientCity }}</p>
              <p>{{ invoice.clientZipCode }}</p>
              <p>{{ invoice.clientCountry }}</p>
            </div>
          </div>

          <div>
            <p class="heading">sent to</p>
            <p class="detail !lowercase">{{ invoice.clientEmail }}</p>
          </div>
        </div>
        <div>
          <DataTable
            unstyled
            :value="invoice.invoiceItemList"
            tableStyle="min-width: 50rem"
            dataKey="invoiceDetails"
            :pt="{
              table: {
                class: 'dark:bg-primary-5 bg-secondary-2 w-full',
              },
              thead: {
                class: 'border-b-2 border-primary-3',
              },
            }"
          >
            <Column
              field="itemName"
              header="Item name"
              style="min-width: 10rem"
              :pt="{
                headerCell: {
                  class: 'text-left p-4  duration-500',
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
              field="quantity"
              header="Qty"
              :pt="{
                headerCell: {
                  class: 'text-left p-4  duration-500',
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
              field="price"
              header="Price (&#8358;)"
              :pt="{
                headerCell: {
                  class: 'text-left p-4  duration-500',
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
                {{ Number(slotProps.data.price).toLocaleString() }}
              </template>
            </Column>
            <Column
              field="total"
              header="Total (&#8358;)"
              :pt="{
                headerCell: {
                  class: 'text-left p-4  duration-500',
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
                {{ slotProps.data.total.toLocaleString() }}
              </template>
            </Column>
          </DataTable>
          <div
            class="flex justify-between bg-primary-3 p-6 rounded-b-lg text-secondary-1"
          >
            <h1 class="text-xl capitalize">Amount due</h1>
            <h1 class="text-3xl">
              &#8358;{{ invoice.invoiceTotal.toLocaleString() }}
            </h1>
          </div>
        </div>
      </div>
    </div>

    <!-- If error -->
    <div
      v-if="error && !isLoadingInvoice"
      class="flex flex-col justify-center items-center h-[40dvh] gap-4"
    >
      <i
        class="pi pi-file-word text-6xl dark:text-secondary-1 text-primary-5"
      ></i>
      <p
        class="text-4xl text-center dark:text-secondary-1 text-primary-5 font-semibold"
      >
        {{ error }}!!
      </p>
    </div>
  </div>
</template>

<style scoped>
tbody {
  @apply bg-red-500;
}
.table {
  @apply !bg-red-500;
}

.heading {
  @apply text-base capitalize font-medium;
}
.detail {
  @apply text-lg font-semibold capitalize;
}
</style>
