import { ActionContext } from "vuex/types/index.js";

interface InvoiceItemType {
  quantity: number;
  price: number;
  total?: number;
  itemName: string;
  id: string;
}

interface CreateInvoiceFormDataType {
  billerStreetAddress: string;
  billerCity: string;
  billerZipCode: string;
  billerCountry: string;
  clientName: string;
  clientEmail: string;
  clientStreetAddress: string;
  clientCity: string;
  clientZipCode: string;
  clientCountry: string;
  invoiceDate: Date;
  paymentTerms: { days: string; value: number } | null;
  paymentDueDate: Date | null;
  productDescription: string;
  invoicePending: null | boolean;
  invoiceDraft: null | boolean;
  invoiceTotal: number;
}

interface InvoiceStateType {
  isLoadingInvoice: boolean;
  invoices: InvoiceItemType[];
}

export enum MutationEnuType {
  // CreateInvoice = "CREATE_INVOICE",
  SetLoading = "SET_LOADING",
  SetInvoices = "SET_INVOICES",
}

interface MutationType {
  // [MutationEnuType.CreateInvoice](
  //   state: InvoiceStateType,
  //   invoice: InvoiceItemType
  // ): void;
  [MutationEnuType.SetLoading](state: InvoiceStateType, value: boolean): void;
  [MutationEnuType.SetInvoices](
    state: InvoiceStateType,
    invoices: InvoiceItemType[]
  ): void;
}

export enum ActionEnuType {
  GetInvoices = "GET_INVOICES",
}

type ActionAugments = Omit<
  ActionContext<InvoiceStateType, InvoiceStateType>,
  "commit"
> & {
  commit<K extends keyof MutationType>(
    key: K,
    palaod: Parameters<MutationType[k]>[1]
  ): ReturnType<MutationType[k]>;
};

interface Actions {
  [ActionEnuType.GetInvoices](context: ActionAugments): void;
}
