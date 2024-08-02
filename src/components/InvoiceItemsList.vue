<script setup lang="ts">
import InputNumber from "primevue/inputnumber";
import { computed, ref } from "vue";

const props = defineProps<{
  invoiceItems: InvoiceItemType[];
}>();

const onRowEditSave = (event: any) => {
  let { newData, index } = event;
  props.invoiceItems[index] = newData;
};

const invoiceTotal = computed(() => {
  let total = 0;
  props.invoiceItems.forEach((item) => {
    total += item.total!;
  });
  return total;
});
const editingRows = ref([]);
const selectedItem = ref<InvoiceItemType>();
const deleteItemDialog = ref(false);

const confirmDeleteItem = (item: InvoiceItemType) => {
  selectedItem.value = item;
  deleteItemDialog.value = true;
};
const emit = defineEmits(["deleteInvoiceItem"]);

const deleteItem = () => {
  if (selectedItem.value) {
    emit("deleteInvoiceItem", selectedItem.value.id);
    deleteItemDialog.value = false;
  }
};
</script>
<template>
  <div class="my-7 space-y-3">
    <h1
      class="text-primary-5 text-lg dark:text-secondary-1 font-semibold capitalize"
    >
      Invoice items
    </h1>
    <DataTable
      :value="invoiceItems"
      editMode="row"
      dataKey="id"
      scrollable
      @row-edit-save="onRowEditSave"
      v-model:editingRows="editingRows"
    >
      <Column field="itemName" header="Item name" style="min-width: 200px">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="w-[200px] border-2" />
        </template>
      </Column>
      <Column field="price" header="Price (&#8358;)" style="">
        <template #editor="{ data, field }">
          <InputNumber
            v-model="data[field]"
            class="w-[300px] border-2"
            inputId="integeronly"
            :min="0"
            :step="100"
            showButtons
            buttonLayout="horizontal"
          >
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
        </template>
      </Column>
      <Column field="quantity" header="Quantity" style="">
        <template #editor="{ data, field }">
          <InputNumber
            v-model="data[field]"
            showButtons
            class="w-[150px] border-2"
            inputId="integeronly"
            fluid
            buttonLayout="horizontal"
            :min="0"
          >
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
        </template>
      </Column>
      <Column field="total" header="Total (&#8358;)" style="">
        <template #body="{ data, field }">
          <!-- <InputNumber
            v-model="data.quantity * data.price"
            class="w-[150px] border-2"
            inputId="integeronly"
            fluid
            :min="0"
            disabled
          /> -->
          <!-- ${{ (data.quantity * data.price).toLocaleString() }} -->
          {{ (data[field] = data.quantity * data.price) }}
        </template>
      </Column>
      <Column
        :rowEditor="true"
        bodyStyle="text-align:center"
        class="min-w-[8rem] w-[10%]"
      >
      </Column>

      <Column :exportable="false">
        <template #body="slotProps">
          <Button
            icon="pi pi-trash"
            outlined
            rounded
            severity="danger"
            class="w-fit"
            @click="confirmDeleteItem(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
    <div
      v-if="invoiceItems.length > 0"
      class="flex justify-between bg-primary-3 p-4 rounded-b-lg text-secondary-1"
    >
      <h1 class="text-xl capitalize">Amount due</h1>
      <h1 class="text-3xl">&#8358;{{ invoiceTotal.toLocaleString() }}</h1>
    </div>
    <Dialog
      v-model:visible="deleteItemDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
      :pt="{
        root: {
          class: 'dark:bg-primary-5 dark:text-secondary-1',
        },
      }"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="selectedItem && selectedItem.itemName !== ''">
          Are you sure you want to delete <b>{{ selectedItem.itemName }}</b
          >?
        </span>
        <span v-else> Are you sure you want to delete <b>New item</b>? </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          type="button"
          class="primary-btn"
          @click="deleteItemDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          type="button"
          class="warning-btn"
          @click="deleteItem"
        />
        <!-- @click="emit('deleteInvoiceItem', selectedItem!.id)" -->
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.p-datatable {
  @apply !w-full min-w-0 overflow-auto;
}
.p-datatable :deep(.p-datatable-table-container) {
  @apply !min-w-[500px] !overflow-auto;
}
</style>
