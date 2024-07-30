<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { reactive, ref, watch } from "vue";
import FormInput from "./common/FormInput.vue";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import InvoiceItemsList from "./InvoiceItemsList.vue";
import { uid } from "uid";
import { useToast } from "primevue/usetoast";
import { db } from "../firebase/firebaseInit";
import { collection, addDoc } from "firebase/firestore";
import { useField, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { InvoiceItemType } from "../types";

const toast = useToast();

const visible = ref(false);
const discardDialogvisible = ref(false);
const loading = ref(false);

const initialState = {
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
  paymentDueDate: null,
  paymentTerms: {},
  productDescription: "",
  invoicePending: null,
  invoiceDraft: null,
  invoicePaid: null,
  invoiceTotal: 0,
};

const validationSchema = toTypedSchema(
  zod.object({
    billerStreetAddress: zod
      .string({ required_error: "street is required" })
      .min(1, { message: "street is required" }),
    billerCity: zod
      .string({ required_error: "city is required" })
      .min(1, { message: "city is required" }),
    billerZipCode: zod
      .string({ required_error: "zip code is required" })
      .min(1, { message: "zip code is required" }),
    billerCountry: zod
      .string({ required_error: "country is required" })
      .min(1, { message: "country is required" }),
    clientName: zod
      .string({ required_error: "client name is required" })
      .min(1, { message: "client name is required" }),
    clientEmail: zod
      .string({ required_error: "email is required" })
      .min(1, { message: "client name is required" })
      .email({ message: "invalid  email" }),
    clientStreetAddress: zod
      .string({ required_error: "street is required" })
      .min(1, { message: "street is required" }),
    clientCity: zod
      .string({ required_error: "city is required" })
      .min(1, { message: "city is required" }),
    clientZipCode: zod
      .string({ required_error: "zip code is required" })
      .min(1, { message: "zip code is required" }),
    clientCountry: zod
      .string({ required_error: "country is required" })
      .min(1, { message: "country is required" }),
    productDescription: zod
      .string({ required_error: "product description is required" })
      .min(1, { message: "product description is required" }),
    invoicePending: zod.boolean().nullable(),
    invoiceDraft: zod.boolean().nullable(),
    invoicePaid: zod.boolean().nullable(),
    invoiceDate: zod.date(),
    paymentDueDate: zod.date().nullable(),
    paymentTerms: zod.object(
      {
        days: zod.string(),
        value: zod.number(),
      },
      { required_error: "select payment terms" }
    ),
    invoiceTotal: zod.number().nullable(),
  })
);
const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema,
  validateOnMount: false,
  keepValuesOnUnmount: true,
  initialValues: initialState,
});

const paymentTermsData = ref([
  { days: "Net 30 days", value: 30 },
  { days: "Net 60 days", value: 60 },
]);

const invoiceItems = reactive<InvoiceItemType[]>([]);

const handleSaveDraft = async () => {
  setFieldValue("invoiceDraft", true);
};
const handleFormReset = () => {
  resetForm();
  invoiceItems.splice(0, invoiceItems.length);
};

const handleCloseModal = () => {
  handleFormReset();
  visible.value = false;
  discardDialogvisible.value = false;
};

const deleteInvoiceItem = (id: string) => {
  const index = invoiceItems.findIndex(
    (item: InvoiceItemType) => item.id === id
  );
  if (index !== -1) {
    invoiceItems.splice(index, 1);
  }
};

const getInvoiceTotal = () => {
  let total = 0;
  invoiceItems.forEach((item) => {
    total += item.total!;
  });
  setFieldValue("invoiceTotal", total);
};

const addNewInvoiceItem = () => {
  const newInvoiceItem: InvoiceItemType = {
    id: uid(),
    itemName: "",
    price: 0,
    quantity: 0,
    total: 0,
  };
  invoiceItems.push(newInvoiceItem);
};

const handlePublishInvoice = handleSubmit(async (values) => {
  if (invoiceItems.length <= 0) {
    return toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please add invoice items",
      life: 3000,
    });
  }
  loading.value = true;
  const dbBase = collection(db, "invoice");
  const newInvoice = {
    invoiceId: uid(6),
    ...values,
    invoicePending: true,
    invoiceItemList: invoiceItems,
  };

  console.log(newInvoice);

  await addDoc(dbBase, newInvoice);

  loading.value = false;
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Invoice created successfully",
    life: 3000,
  });
  handleCloseModal();
});

const { value: invoiceDate } = useField("invoiceDate", validationSchema);
const { value: paymentTerms, errorMessage: paymentTermsError } = useField(
  "paymentTerms",
  validationSchema
);

const { value: paymentDueDate } = useField("paymentDueDate", validationSchema);

watch(paymentTerms, () => {
  // @ts-ignore
  if (paymentTerms?.value?.value) {
    const futureDate = new Date();
    const paymentDueDate = new Date(
      // @ts-ignore
      futureDate.setDate(futureDate.getDate() + paymentTerms.value.value)
    );
    setFieldValue("paymentDueDate", paymentDueDate);
  }
});

watch(invoiceItems, () => {
  getInvoiceTotal();
});
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
    <Dialog
      :closable="false"
      v-model:visible="visible"
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
            <FormInput label="street address" name="billerStreetAddress" />
            <div class="grid md:grid-cols-3 gap-2">
              <FormInput label="city" name="billerCity" />
              <FormInput label="zip cdoe" type="number" name="billerZipCode" />
              <FormInput label="country" name="billerCountry" />
            </div>
          </div>
          <!-- Bill to -->
          <div class="space-y-3">
            <h1
              class="text-lg text-primary-5 dark:text-secondary-1 font-semibold"
            >
              Bill To
            </h1>
            <FormInput name="clientName" label="client name" />
            <FormInput name="clientEmail" label=" client email" />
            <FormInput name="clientStreetAddress" label="street address" />
            <div class="grid md:grid-cols-3 gap-2">
              <FormInput name="clientCity" label="city" />
              <FormInput name="clientZipCode" type="number" label="zip code" />
              <FormInput name="clientCountry" label="country" />
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
                <DatePicker v-model="invoiceDate" disabled id="invoiceDate" />
              </div>
              <!-- Payment terms -->
              <div class="flex flex-col gap-2 w-full">
                <label
                  for="paymentTerms"
                  class="text-primary-5 dark:text-secondary-1 capitalize"
                  >Select payment terms</label
                >
                <Select
                  v-model="paymentTerms"
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
                <span v-if="paymentTermsError" class="text-red-400 text-sm">{{
                  paymentTermsError
                }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-2 w-full">
              <label
                for="invoiceDueDate"
                class="text-primary-5 dark:text-secondary-1 capitalize"
                >Payment due date</label
              >
              <DatePicker
                disabled
                v-model="paymentDueDate"
                id="invoiceDueDate"
              />
            </div>

            <FormInput name="productDescription" label="product description" />
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

<style lang="css" scoped>
.p-datepicker {
  @apply h-10 text-base;
}
.p-datepicker :deep(.p-datepicker-input) {
  @apply p-2 dark:bg-primary-1 bg-secondary-1;
}
</style>
