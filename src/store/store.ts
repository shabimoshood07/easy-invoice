import { defineStore } from "pinia";
import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { CreateInvoiceFormDataType } from "../types";

export const useInvoiceStore = defineStore("invoice", () => {
  const invoices = ref<(CreateInvoiceFormDataType & { id: string })[]>([]);
  const isLoadingInvoices = ref<boolean>(false);
  const getAllInvoices = async () => {
    try {
      isLoadingInvoices.value = true;
      const dbBase = collection(db, "invoice");
      const querySnapshot = await getDocs(dbBase);
      const invoicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (CreateInvoiceFormDataType & { id: string })[];
      invoices.value = invoicesData;
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingInvoices.value = false;
    }
  };
  return { invoices, isLoadingInvoices, getAllInvoices };
});
