import { ActionTree, MutationTree } from "vuex/types/index.js";
import {
  ActionEnuType,
  Actions,
  InvoiceStateType,
  MutationEnuType,
  MutationType,
} from "../../types";
import { db } from "../../firebase/firebaseInit";
import { collection } from "firebase/firestore";

export const state: InvoiceStateType = {
  isLoadingInvoice: false,
  invoices: [],
};

export const mutations: MutationTree<InvoiceStateType> & MutationType = {
  [MutationEnuType.SetInvoices](state, invoices) {
    state.invoices = invoices;
  },
  [MutationEnuType.SetLoading](state, value) {
    state.isLoadingInvoice = value;
  },
};

export const actions: ActionTree<InvoiceStateType, InvoiceStateType> & Actions =
  {
    async [ActionEnuType.GetInvoices]({ commit }) {
      commit(MutationEnuType.SetLoading, true);
      const dbBase = collection(db, "invoices");

      const results = await dbBase.get();
      commit(MutationEnuType.SetInvoices, results);
      // const results = await db.collection("invoices").get();
    },
  };
