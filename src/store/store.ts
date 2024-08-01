import { defineStore } from "pinia";
import { ref } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseInit";

export const useInvoiceStore = defineStore("invoice", () => {
  const invoices = ref<InvoiceType[]>([]);
  const isLoadingInvoices = ref<boolean>(false);
  const isLoadingInvoice = ref<boolean>(false);
  const invoiceItems = ref<InvoiceItemType[]>([]);

  const getAllInvoices = async () => {
    try {
      isLoadingInvoices.value = true;
      const dbBase = collection(db, "invoice");
      const querySnapshot = await getDocs(dbBase);
      const invoicesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvoiceType[];
      invoices.value = invoicesData;
    } catch (error) {
      console.log(error);
    } finally {
      isLoadingInvoices.value = false;
    }
  };
  const getInvoice = async (
    invoiceId: string
  ): Promise<{ invoices: InvoiceType[] } | { error: string }> => {
    try {
      isLoadingInvoice.value = true;
      const dbBase = collection(db, "invoice");
      const q = query(dbBase, where("invoiceId", "==", invoiceId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return { error: "No matching documents" };
      }

      const invoices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvoiceType[];

      return { invoices };
    } catch (error) {
      return { error: "An error occured" };
    } finally {
      isLoadingInvoice.value = false;
    }
  };
  return {
    invoices,
    isLoadingInvoices,
    getAllInvoices,
    getInvoice,
    invoiceItems,
    isLoadingInvoice,
  };
});

export const useCreateInvoiceModalStore = defineStore("invoice-modal", () => {
  const invoiceModalVisible = ref<boolean>(false);
  const editedInvoice = ref<InvoiceType | null>(null);
  const toggleInvoiceModalVisible = () =>
    (invoiceModalVisible.value = !invoiceModalVisible.value);
  return {
    invoiceModalVisible,
    toggleInvoiceModalVisible,
    editedInvoice,
  };
});
