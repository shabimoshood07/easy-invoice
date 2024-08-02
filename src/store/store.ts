import { defineStore } from "pinia";
import { ref } from "vue";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseInit";
import { uid } from "uid";

const removeUndefinedId = (obj: any) => {
  if (obj.id === undefined) {
    delete obj.id;
  }
  return obj;
};
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
  ): Promise<{ invoices: InvoiceType[] }> => {
    try {
      isLoadingInvoice.value = true;
      const dbBase = collection(db, "invoice");
      const q = query(dbBase, where("invoiceId", "==", invoiceId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("No matching documents");
      }

      const invoices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as InvoiceType[];

      return { invoices };
    } catch (error: any) {
      throw new Error(error.message);
    } finally {
      isLoadingInvoice.value = false;
    }
  };

  const createNewInvoice = async (newInvoiceData: any) => {
    try {
      const dbBase = collection(db, "invoice");
      const newInvoice = {
        ...newInvoiceData,
        invoiceId: uid(6),
        invoicePending: true,
        invoiceItemList: invoiceItems.value,
      };
      const cleanedInvoice = removeUndefinedId(newInvoice);
      await addDoc(dbBase, cleanedInvoice);
      return { message: "invoice created successfully" };
    } catch (error: any) {
      console.log(error);

      throw new Error(error.message);
    }
  };

  const updateInvoice = async (newInvoiceData: any) => {
    try {
      const id = newInvoiceData.id;
      const updateInvoiceRef = doc(db, "invoice", id);
      const docSnapshot = await getDoc(updateInvoiceRef);
      if (!docSnapshot.exists()) {
        throw new Error("document does not exist");
      }
      await updateDoc(updateInvoiceRef, {
        ...newInvoiceData,
      });

      return { message: "invoice updated successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const markInvoiceAsPaid = async (newInvoiceData: InvoiceType) => {
    try {
      const id = newInvoiceData.id;
      const updateInvoiceRef = doc(db, "invoice", id);
      const docSnapshot = await getDoc(updateInvoiceRef);
      if (!docSnapshot.exists()) {
        throw new Error("document does not exist");
      }
      await updateDoc(updateInvoiceRef, {
        invoicePending: null,
        invoicePaid: true,
      });

      return { message: "invoice updated successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };
  const markInvoiceAsPending = async (newInvoiceData: InvoiceType) => {
    try {
      const id = newInvoiceData.id;
      const updateInvoiceRef = doc(db, "invoice", id);
      const docSnapshot = await getDoc(updateInvoiceRef);
      if (!docSnapshot.exists()) {
        throw new Error("document does not exist");
      }
      await updateDoc(updateInvoiceRef, {
        invoicePending: true,
        invoicePaid: false,
      });

      return { message: "invoice updated successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const deleteInvoice = async (newInvoiceData: any) => {
    try {
      const id = newInvoiceData.id;
      const deleteInvoiceRef = doc(db, "invoice", id);
      const docSnapshot = await getDoc(deleteInvoiceRef);
      if (!docSnapshot.exists()) {
        throw new Error("document does not exist");
      }
      await deleteDoc(deleteInvoiceRef);
      return { message: "invoice deleted successfully" };
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  return {
    invoices,
    isLoadingInvoices,
    getAllInvoices,
    getInvoice,
    invoiceItems,
    isLoadingInvoice,
    createNewInvoice,
    updateInvoice,
    markInvoiceAsPaid,
    markInvoiceAsPending,
    deleteInvoice,
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
