<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  invoiceItems: InvoiceItemType[];
  //   deleteInvoiceItem: (id: string) => void;
}>();

const onRowEditSave = (event: any) => {
  let { newData, index } = event;
  props.invoiceItems[index] = newData;
};
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
    <h1 class="text-primary-5 text-lg dark:text-secondary-1 font-semibold capitalize">Invoice items</h1>
    <DataTable
      :value="invoiceItems"
      editMode="row"
      dataKey="id"
      scrollable
      @row-edit-save="onRowEditSave"
      v-model:editingRows="editingRows"
    >
      <Column frozen field="itemName" header="Item name" style="width: 40%">
        <template #editor="{ data, field }">
          <InputText v-model="data[field]" class="w-[200px] border-2" />
        </template>
      </Column>
      <Column field="price" header="Price" style="">
        <template #editor="{ data, field }">
          <InputText
            v-model="data[field]"
            class="w-[100px] border-2"
            type="number"
          />
        </template>
      </Column>
      <Column field="quantity" header="Quantity" style="">
        <template #editor="{ data, field }">
          <InputText
            v-model="data[field]"
            class="w-[100px] border-2"
            type="number"
          />
        </template>
      </Column>
      <Column field="total" header="Total" style="">
        <template #body="{ data, field }">
          ${{ (data[field] = data.quantity * data.price) }}
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
        <span v-if="selectedItem && selectedItem.itemName !== ''"
          >Are you sure you want to delete <b>{{ selectedItem.itemName }}</b
          >?
        </span>
        <span v-else> >Are you sure you want to delete <b>New item</b>? </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          text
          @click="deleteItemDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          type="button"
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
