<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { reactive, ref, toRefs, watch } from "vue";
import FormInput from "./common/FormInput.vue";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import InvoiceItemsList from "./InvoiceItemsList.vue";
import { uid } from "uid";
import { useToast } from "primevue/usetoast";
import { db } from "../firebase/firebaseInit";
import { collection, addDoc } from "firebase/firestore";
import { title } from "process";
const toast = useToast();

const visible = ref(false);
const discardDialogvisible = ref(false);
const loading = ref(false);

const initialState = {
  billerName: "",
  billerStreetAddress: "",
  billerCity: "",
  billerZipCode: "",
  billerCountry: "",
  clientName: "",
  clientEmail: "",
  clientStreetAddress: "",
  clientCity: "",
  clientZipCode: "",
  clientCountry: "",
  invoiceDate: new Date(),
  paymentTerms: null,
  paymentDueDate: null,
  productDescription: "",
  invoicePending: null,
  invoiceDraft: null,
  invoiceTotal: 0,
};

const data = reactive<CreateInvoiceFormDataType>({
  billerName: "",
  billerStreetAddress: "",
  billerCity: "",
  billerZipCode: "",
  billerCountry: "",
  clientName: "",
  clientEmail: "",
  clientStreetAddress: "",
  clientCity: "",
  clientZipCode: "",
  clientCountry: "",
  invoiceDate: new Date(),
  paymentTerms: null,
  paymentDueDate: null,
  productDescription: "",
  invoicePending: null,
  invoiceDraft: null,
  invoiceTotal: 0,
});

const paymentTermsData = ref([
  { days: "Net 30 days", value: 30 },
  { days: "Net 60 days", value: 60 },
]);

const invoiceItems = ref<InvoiceItemType[]>([
  // {
  //   id: uid(),
  //   itemName: "car",
  //   price: 50,
  //   quantity: 5,
  //   total: 0,
  // },
  // {
  //   id: uid(),
  //   itemName: "house",
  //   price: 500,
  //   quantity: 2,
  //   total: 0,
  // },
]);

const resetForm = () => {
  for (const [key, value] of Object.entries(initialState)) {
    (data as any)[key] = value;
  }
  invoiceItems.value = [];
  data.paymentDueDate = null;
};
const handlePublishInvoice = async () => {
  if (invoiceItems.value.length <= 0) {
    return toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please add invoice items",
      life: 3000,
    });
  }
  loading.value = true;
  data.invoicePending = true;
  const dbBase = collection(db, "invoice");
  const newInvoice = {
    invoiceId: uid(6),
    ...data,
    invoiceItemList: invoiceItems.value,
  };
  await addDoc(dbBase, newInvoice);

  loading.value = false;
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Invoice created successfully",
    life: 3000,
  });
  handleCloseModal();
};

const handleSaveDraft = async () => {
  data.invoiceDraft = true;
  console.log(data);
};

const handleCloseModal = () => {
  visible.value = false;
  discardDialogvisible.value = false;
  resetForm();
};

const deleteInvoiceItem = (id: string) => {
  const filteredData = invoiceItems.value.filter(
    (item: InvoiceItemType) => item.id !== id
  );
  invoiceItems.value = filteredData;
};

const getInvoiceTotal = () => {
  data.invoiceTotal = 0;
  invoiceItems.value.forEach((item) => {
    data.invoiceTotal += item.total!;
  });
};

const addNewInvoiceItem = () => {
  const newInvoiceItem: InvoiceItemType = {
    id: uid(),
    itemName: "",
    price: 0,
    quantity: 0,
    total: 0,
  };

  invoiceItems.value.push(newInvoiceItem);
};

const { paymentTerms } = toRefs(data);
watch(paymentTerms, () => {
  if (data.paymentTerms) {
    const futureDate = new Date();
    data.paymentDueDate = new Date(
      futureDate.setDate(futureDate.getDate() + data.paymentTerms.value)
    );
  }
});

watch(invoiceItems.value, () => {
  getInvoiceTotal();
});

const test = () => {
  discardDialogvisible.value = true;
};
</script>
<template>
  <div>
    <Button
      icon="pi pi-plus"
      label="Create invoice"
      iconPos="right"
      @click="() => (visible = true)"
      class="primary-btn text-base font-semibold"
    />
    <!-- Create invoice dialog -->
    <!-- :update:visible="(value:boolean)=> value ? discardDialogvisible=false : discardDialogvisible=true" -->
    <!-- :update:visible="discardDialogvisible" -->
    <Dialog
      v-model:visible="visible"
      :closable="false"
      header="New Invoice"
      position="left"
      :modal="true"
      :draggable="false"
      dismissableMask
      class="w-full max-w-[700px] m-0 h-full max-h-none rounded-none bg-primary-1 dark:bg-primary-4 border-none"
      :pt="{
        title: {
          class: 'text-primary-5 text-2xl dark:text-secondary-1 ',
        },
        pcCloseButton: {
          class: 'text-primary-5 dark:text-secondary-1 ',
        },
        mask: {
          class: 'backdrop-blur-sm',
        },
      }"
    >
      <form action="" @submit.prevent="handlePublishInvoice">
        <div class="space-y-12">
          <!-- Bill from -->
          <div class="space-y-3">
            <h1
              class="text-lg text-primary-5 dark:text-secondary-1 font-semibold"
            >
              Bill from
            </h1>
            <FormInput
              v-model="data.billerStreetAddress"
              label="street address"
            />
            <div class="grid md:grid-cols-3 gap-2">
              <FormInput v-model="data.billerCity" label=" city" />
              <FormInput
                v-model="data.billerZipCode"
                type="number"
                label="zip cdoe"
              />
              <FormInput v-model="data.billerCountry" label="country" />
            </div>
          </div>

          <!-- Bill to -->
          <div class="space-y-3">
            <h1
              class="text-lg text-primary-5 dark:text-secondary-1 font-semibold"
            >
              Bill To
            </h1>
            <FormInput v-model="data.clientName" label="client name" />
            <FormInput v-model="data.clientEmail" label=" client email" />
            <FormInput
              v-model="data.clientStreetAddress"
              label="street address"
            />
            <div class="grid md:grid-cols-3 gap-2">
              <FormInput v-model="data.clientCity" label="city" />

              <FormInput
                v-model="data.clientZipCode"
                type="number"
                label="zip code"
              />
              <FormInput v-model="data.clientCountry" label="country" />
            </div>
          </div>

          <!-- Invoice details -->
          <div class="space-y-3">
            <div class="grid lg:grid-cols-2 gap-2">
              <!-- Date -->
              <div class="flex flex-col gap-2 w-full">
                <label
                  for="invoiceDate"
                  class="text-primary-5 dark:text-secondary-1 capitalize"
                  >Invoice date</label
                >
                <DatePicker
                  v-model="data.invoiceDate"
                  disabled
                  id="invoiceDate"
                />
              </div>
              <div class="flex flex-col gap-2 w-full">
                <label
                  for="invoiceDueDate"
                  class="text-primary-5 dark:text-secondary-1 capitalize"
                  >Payment due date</label
                >
                <DatePicker
                  disabled
                  v-model="data.paymentDueDate"
                  id="invoiceDueDate"
                />
              </div>
            </div>
            <!-- Payment terms -->
            <div class="flex flex-col gap-2 w-full">
              <label
                for="paymentTerms"
                class="text-primary-5 dark:text-secondary-1 capitalize"
                >Select payment terms</label
              >
              <Select
                v-model="data.paymentTerms"
                id="paymentTerms"
                :options="paymentTermsData"
                optionLabel="days"
                placeholder="Select payment terms"
                class="w-full"
                checkmark
                :highlightOnSelect="true"
                :pt="{
                  root: {
                    class:
                      'h-10 justify-center bg-secondary-1 dark:bg-primary-1 items-center',
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

            <FormInput
              v-model="data.productDescription"
              label="product description"
            />
          </div>
        </div>

        <InvoiceItemsList
          :invoiceItems="invoiceItems"
          @deleteInvoiceItem="deleteInvoiceItem"
        />
        <Button
          @click="addNewInvoiceItem"
          label="Add new item"
          class="primary-btn w-full"
        />

        <div class="flex justify-between gap-2 my-10">
          <Button
            type="button"
            label="Discard"
            severity=""
            @click="discardDialogvisible = true"
            :disabled="loading"
            class="warning-btn min-w-[150px]"
          ></Button>
          <div class="flex gap-2">
            <Button
              type="button"
              label="Save draft"
              @click="handleSaveDraft"
              :disabled="loading"
              class="primary-btn"
            />
            <Button
              type="submit"
              :loading="loading"
              :icon="loading && 'pi-spin pi-spinner'"
              :label="loading ? '' : 'Create invoice'"
              class="primary-btn"
            />
          </div>
        </div>
      </form>
    </Dialog>

    <!-- Discard dialog -->
    <Dialog
      v-model:visible="discardDialogvisible"
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
      <span class="text-primary-5 text-base dark:text-surface-400 block mb-8"
        >All unsaved changes will be lost</span
      >

      <div class="flex justify-end gap-2">
        <Button
          type="button"
          label="Discard"
          severity="secondary"
          @click="handleCloseModal"
          class="warning-btn"
        ></Button>
        <Button
          type="button"
          label="Resume"
          class="primary-btn"
          @click="discardDialogvisible = false"
        ></Button>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.p-datepicker {
  @apply h-10 text-base;
}
.p-datepicker :deep(.p-datepicker-input) {
  @apply p-2 dark:bg-primary-1 bg-secondary-1;
}
</style>
