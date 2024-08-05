<script setup lang="ts">
// @ts-ignore
import html2pdf from "html2pdf.js";
import { useInvoiceStore } from "../store/store";
const invoiceStore = useInvoiceStore();
const { currentInvoice } = invoiceStore;

const exportToPdf = () => {
  var element = document.getElementById("pdf-element");
  var opt = {
    margin: 1,
    filename: `${currentInvoice!.productDescription}`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    // jsPDF: { unit: "mm", format: [595.28, 841.89], orientation: "portrait" },
    jsPDF: { unit: "mm", format: "letter", orientation: "portrait" },
    // jsPDF: { unit: "in", format: "a1", orientation: "portrait" },
  };
  // New Promise-based usage:
  html2pdf().set(opt).from(element).save();
};
</script>
<template>
  <div class="flex justify-end">
    <Button
      icon="pi pi-external-link"
      label="Export as pdf"
      @click="exportToPdf"
      class="primary-btn"
    />
  </div>
</template>

<style scoped></style>
