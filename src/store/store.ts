// import { createStore } from "vuex";
// import { InvoiceStateType } from "../types";
// import { actions, mutations, state } from "./modules/invoice";

// export const store = createStore<InvoiceStateType>({
//   state,
//   mutations,
//   actions,
// });

import { collection, getDocs } from "firebase/firestore";
import { createStore } from "vuex";
import { db } from "../firebase/firebaseInit";
import { InvoiceItemType } from "../types";

interface State {
  invoices: InvoiceItemType[];
  isLoadingInvoices: boolean;
  error: string | null;
}

export default createStore({
  state: (): State => ({
    invoices: [],
    isLoadingInvoices: false,
    error: null,
  }),
  getters: {
    getInvoices: (state: State) => state.invoices,
    isLoadingInvoices: (state: State) => state.isLoadingInvoices,
    getError: (state: State) => state.error,
  },
  mutations: {
    SET_INVOICES(state: State, invoices: InvoiceItemType[]) {
      state.invoices = invoices;
    },
    SET_LOADING(state: State, isLoading: boolean) {
      state.isLoadingInvoices = isLoading;
    },
    SET_ERROR(state: State, error: any) {
      state.error = error;
    },
  },
  actions: {
    async GET_INVOICES({ commit }) {
      commit("SET_LOADING", true);
      commit("SET_ERROR", null);
      try {
        const dbBase = collection(db, "invoice");
        const querySnapshot = await getDocs(dbBase);
        console.log(querySnapshot, "querySnapshot");

        const invoices = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(invoices, "invoices");

        commit("SET_INVOICES", invoices);
      } catch (error) {
        commit("SET_ERROR", error);
      } finally {
        commit("SET_LOADING", false);
      }
    },
  },
});
