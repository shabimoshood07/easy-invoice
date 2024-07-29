<script setup lang="ts">
import { InvoiceItemType } from "../types";

// defineProps({
//   invoices:InvoiceItemType[]
// })

defineProps<{
  invoices: { invoices: InvoiceItemType[]; required: true };
  isLoadingInvoices: { isLoadingInvoices: boolean };
}>();
</script>
<template>
  <div v-if="isLoadingInvoices">
    <h1>Loading...............</h1>
  </div>
  <div v-else>{{ JSON.stringify(invoices) }}</div>
</template>

<style scoped></style>
