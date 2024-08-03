<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { ref, watch } from "vue";
import FormInput from "./common/FormInput.vue";
import Select from "primevue/select";
import DatePicker from "primevue/datepicker";
import InvoiceItemsList from "./InvoiceItemsList.vue";
import { uid } from "uid";
import { useToast } from "primevue/usetoast";
import { useField, useForm } from "vee-validate";
import {
  useCreateInvoiceModalStore,
  useInvoiceStore,
  useUserStore,
} from "../store/store";
import { storeToRefs } from "pinia";
import { createInvoiceValidationSchema } from "../schemas";
import { formatFirestoreTimestamp } from "../utils";
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

// invoice modal store
const invoiceModalStore = useCreateInvoiceModalStore();
const { invoiceModalVisible, editedInvoice } = storeToRefs(invoiceModalStore);
const { toggleInvoiceModalVisible } = invoiceModalStore;

// invoice store
const invoiceStore = useInvoiceStore();
const { getAllInvoices, createNewInvoice, updateInvoice } = invoiceStore;
const { invoiceItems } = storeToRefs(invoiceStore);

// user store
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const toast = useToast();
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

const { handleSubmit, resetForm, setFieldValue } = useForm({
  validationSchema: createInvoiceValidationSchema,
  validateOnMount: false,
  keepValuesOnUnmount: true,
  initialValues: initialState,
});

const paymentTermsData = ref([
  { days: "Net 30 days", value: 30 },
  { days: "Net 60 days", value: 60 },
]);

const handleSaveDraft = async () => {
  setFieldValue("invoiceDraft", true);
};
const handleFormReset = () => {
  resetForm();
};

const handleCloseModal = () => {
  handleFormReset();
  invoiceItems.value = [];
  editedInvoice.value = null;
  discardDialogvisible.value = false;
  toggleInvoiceModalVisible();
};

const deleteInvoiceItem = (id: string) => {
  const index = invoiceItems.value.findIndex(
    (item: InvoiceItemType) => item.id === id
  );
  if (index !== -1) {
    invoiceItems.value.splice(index, 1);
  }
};

const getInvoiceTotal = () => {
  let total = 0;
  invoiceItems.value.forEach((item) => {
    total += item.total!;
  });

  setFieldValue("invoiceTotal", Number(total));
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

const handlePublishInvoice = handleSubmit(async (values) => {
  if (invoiceItems.value.length <= 0) {
    return toast.add({
      severity: "error",
      summary: "Error",
      detail: "Please add invoice items",
      life: 3000,
    });
  }

  if (!editedInvoice.value) {
    try {
      loading.value = true;
      await createNewInvoice({ user: user.value?.uid, ...values });
      toast.add({
        severity: "success",
        summary: "Success",
        detail: "Invoice created successfully",
        life: 3000,
      });
      handleCloseModal();
      return getAllInvoices(user.value!.uid);
    } catch (error: any) {
      return toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      loading.value = false;
    }
  } else {
    try {
      loading.value = true;
      const data = await updateInvoice({
        user: user.value?.uid,
        ...values,
        invoiceItemList: invoiceItems.value,
      });
      toast.add({
        severity: "success",
        summary: "Success",
        detail: data.message,
        life: 3000,
      });
      handleCloseModal();
      if (route.path.startsWith("/invoice")) {
        console.log(values.invoiceId);
        return router.go(0);
      } else {
        return getAllInvoices(user.value!.uid);
      }
    } catch (error: any) {
      return toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      loading.value = false;
    }
  }
});

const { value: invoiceDate } = useField(
  "invoiceDate",
  createInvoiceValidationSchema
);
const { value: paymentTerms, errorMessage: paymentTermsError } = useField(
  "paymentTerms",
  createInvoiceValidationSchema
);

const { value: paymentDueDate } = useField(
  "paymentDueDate",
  createInvoiceValidationSchema
);

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

watch(
  invoiceItems,
  () => {
    getInvoiceTotal();
  },
  { deep: true }
);

const setInvoiceFields = (invoice: InvoiceType) => {
  if (invoice) {
    setFieldValue("billerStreetAddress", invoice.billerStreetAddress);
    setFieldValue("invoiceId", invoice.invoiceId);
    setFieldValue("id", invoice.id);
    setFieldValue("invoiceTotal", invoice.invoiceTotal);
    setFieldValue("invoicePaid", invoice.invoicePaid);
    setFieldValue("invoicePending", invoice.invoicePending);
    setFieldValue("invoiceDraft", invoice.invoiceDraft);
    setFieldValue("billerCity", invoice.billerCity);
    setFieldValue("billerCountry", invoice.billerCountry);
    setFieldValue("billerZipCode", invoice.billerZipCode);
    setFieldValue("clientName", invoice.clientName);
    setFieldValue("clientEmail", invoice.clientEmail);
    setFieldValue("clientCountry", invoice.clientCountry);
    setFieldValue("productDescription", invoice.productDescription);
    setFieldValue(
      "paymentDueDate",
      // @ts-ignore
      formatFirestoreTimestamp(invoice.paymentDueDate)
    );
    setFieldValue("paymentTerms", invoice.paymentTerms);
    setFieldValue("clientStreetAddress", invoice.clientStreetAddress);
    setFieldValue("clientZipCode", invoice.clientZipCode);
    setFieldValue("clientCity", invoice.clientCity);
    // @ts-ignore
    setFieldValue(
      "invoiceDate",
      new Date(formatFirestoreTimestamp(invoice.invoiceDate))
    );
    invoiceItems.value = invoice.invoiceItemList;
  } else {
    handleFormReset();
  }
};

onMounted(() => {
  if (editedInvoice.value) {
    setInvoiceFields(editedInvoice.value);
  }
});

watch(editedInvoice, (newInvoice) => {
  if (newInvoice) {
    setInvoiceFields(newInvoice);
  } else {
    resetForm();
  }
});
</script>
<template>
  <div>
    <!-- Create invoice dialog -->
    <Dialog
      :closable="false"
      v-model:visible="invoiceModalVisible"
      :header="editedInvoice ? 'Edit Invoice' : 'New Invoice'"
      position="left"
      :modal="true"
      :draggable="false"
      dismissableMask
      class="w-full max-w-[800px] m-0 h-full max-h-none rounded-none bg-primary-1 dark:bg-primary-4 border-none"
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
            <!-- :value="editedInvoice?.billerStreetAddress" -->
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
          :invoiceItems="editedInvoice?.invoiceItemList ?? invoiceItems"
          @deleteInvoiceItem="deleteInvoiceItem"
        />
        <Button
          @click="addNewInvoiceItem"
          label="Add new item"
          class="primary-btn w-full"
        />

        <div class="flex justify-between gap-3 my-10 flex-wrap">
          <Button
            type="button"
            :label="editedInvoice ? 'Cancel' : 'Discard'"
            @click="discardDialogvisible = true"
            :disabled="loading"
            class="warning-btn min-w-[150px]"
          ></Button>
          <div class="flex gap-2">
            <Button
              v-if="!editedInvoice"
              type="button"
              label="Save draft"
              @click="handleSaveDraft"
              :disabled="loading"
              class="primary-btn"
            />
            <Button
              type="submit"
              :loading="loading"
              :label="editedInvoice ? 'Update' : 'Create invoice'"
              class="primary-btn min-w-[150px]"
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
