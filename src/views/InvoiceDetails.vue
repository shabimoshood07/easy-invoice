<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import {
  useCreateInvoiceModalStore,
  useInvoiceStore,
  useUserStore,
} from "../store/store";
import { computed, onMounted, ref } from "vue";
import Loading from "../components/common/Loading.vue";
import { storeToRefs } from "pinia";
import { formatFirestoreTimestamp } from "../utils";
import { useToast } from "primevue/usetoast";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
// @ts-ignore
import html2pdf from "html2pdf.js";
// user store
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
// variables
const toast = useToast();
const route = useRoute();
const router = useRouter();
const invoiceId = route.params.invoiceId as string;
const invoiceStore = useInvoiceStore();
const { getInvoice, markInvoiceAsPaid, markInvoiceAsPending, deleteInvoice } =
  invoiceStore;
const { isLoadingInvoice } = storeToRefs(invoiceStore);
const invoiceModalStore = useCreateInvoiceModalStore();
const { editedInvoice } = storeToRefs(invoiceModalStore);
const { toggleInvoiceModalVisible } = invoiceModalStore;
const invoice = ref<InvoiceType | null>(null);
const errorMsg = ref<string | null>(null);
const isUpdating = ref<boolean>(false);
const showDeleteInvoiceModal = ref<boolean>(false);

const getInvoiceDetails = async () => {
  try {
    const data = await getInvoice({ invoiceId, userId: user.value!.uid });
    invoice.value = data.invoices[0];
  } catch (error: any) {
    errorMsg.value = error.message;
  }
};

onMounted(async () => {
  getInvoiceDetails();
});

const handleEditClick = (invoice: InvoiceType) => {
  editedInvoice.value = invoice;
  toggleInvoiceModalVisible();
};
const handleMarkAsPaid = async () => {
  try {
    isUpdating.value = true;
    const data = await markInvoiceAsPaid(invoice.value!);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: data.message,
      life: 3000,
    });
    getInvoiceDetails();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    isUpdating.value = false;
  }
};
const handleMarkAsPending = async () => {
  try {
    isUpdating.value = true;
    const data = await markInvoiceAsPending(invoice.value!);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: data.message,
      life: 3000,
    });
    getInvoiceDetails();
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    isUpdating.value = false;
  }
};
const handleDeleteInvoice = async () => {
  try {
    isUpdating.value = true;
    const data = await deleteInvoice(invoice.value!);
    toast.add({
      severity: "success",
      summary: "Success",
      detail: data.message,
      life: 3000,
    });
    router.replace({ name: "Dashboard" });
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message,
      life: 3000,
    });
  } finally {
    isUpdating.value = false;
  }
};

const invoiceTotal = computed(() => {
  let total = 0;
  invoice.value?.invoiceItemList.forEach((item) => {
    total += item.total!;
  });
  return total;
});

const exportToPdf = () => {
  var element = document.getElementById("pdf-element");
  var opt = {
    margin: 1,
    filename: `${invoice.value?.productDescription}`,
    // image: { type: "jpeg", quality: 0.98 },
    // html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
    // jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
  };
  // New Promise-based usage:
  html2pdf().set(opt).from(element).save();
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
      <div class="space-y-4">
        <div class="flex justify-end">
          <Button
            icon="pi pi-external-link"
            label="Export as pdf"
            @click="exportToPdf"
            class="primary-btn"
          />
        </div>

        <div
          class="bg-primary-1/40 dark:bg-primary-4 rounded-md w-full p-2 py-4 flex justify-between items-center flex-wrap gap-3"
        >
          <div class="flex gap-2 items-center">
            <h1 class="text-lg font-medium dark:text-secondary-1">Status</h1>
            <p
              v-if="invoice?.invoicePending"
              class="bg-red-400 text-secondary-1 p-2 rounded-md flex gap-3 items-center"
            >
              <i class="pi pi-circle-fill text-[10px] text-red-900"></i>
              Pending
            </p>
            <p
              v-if="invoice?.invoicePaid"
              class="bg-green-600 text-lg text-secondary-2 px-2 py-1 rounded-md flex gap-3 items-center justify-center w-[100px]"
            >
              <i class="pi pi-circle-fill text-[10px] text-green-900"></i>
              Paid
            </p>
            <p
              v-if="invoice?.invoiceDraft"
              class="bg-yello-600 text-lg text-secondary-2 px-2 py-1 rounded-md flex gap-3 items-center justify-center w-[100px]"
            >
              <i class="pi pi-circle-fill text-[10px] text-yellow-900"></i>
              Draft
            </p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <Button
              label="Edit"
              class="primary-btn w-[100px] disabled:dark:hover:bg-secondary-1 disabled:hover:bg-primary-3"
              :disabled="invoice.invoicePaid"
              @click="handleEditClick(invoice)"
            />
            <Button
              v-if="invoice.invoicePending"
              label="Mark as paid"
              :loading="isUpdating"
              :disabled="isUpdating"
              class="primary-btn"
              @click="handleMarkAsPaid"
            />

            <Button
              v-else
              label="Mark as pending"
              :loading="isUpdating"
              :disabled="isUpdating"
              loadingIcon="pi pi-spinner pi-spin"
              class="primary-btn"
              @click="handleMarkAsPending"
            />
            <Button
              label="Delete"
              :disabled="isUpdating"
              class="warning-btn w-[100px]"
              @click="showDeleteInvoiceModal = true"
            />
          </div>
        </div>

        <div
          id="pdf-element"
          class="bg-primary-1/40 dark:bg-primary-4 rounded-md w-full p-4 lg:p-6 dark:text-secondary-1 text-primary-5 space-y-10"
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
                &#8358;{{ invoiceTotal.toLocaleString() }}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- If error -->
    <div
      v-if="errorMsg && !isLoadingInvoice"
      class="flex flex-col justify-center items-center h-[40dvh] gap-4"
    >
      <i
        class="pi pi-file-word text-6xl dark:text-secondary-1 text-primary-5"
      ></i>
      <p
        class="text-4xl text-center dark:text-secondary-1 text-primary-5 font-semibold"
      >
        {{ errorMsg }}!!
      </p>
    </div>
  </div>

  <Dialog
    v-model:visible="showDeleteInvoiceModal"
    modal
    header="Discard changes"
    :style="{ width: '25rem' }"
    :closable="false"
    :pt="{
      root: {
        class: 'dark:bg-primary-5 dark:',
      },
      title: {
        class: 'dark:text-secondary-1',
      },
      mask: {
        class: 'backdrop-blur-sm',
      },
    }"
  >
    <div class="space-y-4 mb-6">
      <p class="text-primary-5 dark:text-surface-400 block text-xl">
        Invoice will be deleted permanently
      </p>
      <p class="text-primary-5 text-base dark:text-surface-400 block mb-8">
        This changes can not be undone
      </p>
    </div>

    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Delete"
        :loading="isUpdating"
        severity="secondary"
        @click="handleDeleteInvoice"
        class="warning-btn w-[100px]"
      ></Button>
      <Button
        type="button"
        label="Cancel"
        class="primary-btn w-[100px]"
        :disabled="isUpdating"
        @click="showDeleteInvoiceModal = false"
      ></Button>
    </div>
  </Dialog>
</template>

<style scoped>
.heading {
  @apply text-base capitalize font-medium;
}
.detail {
  @apply text-lg font-semibold capitalize;
}
</style>
