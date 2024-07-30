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
  invoicePaid: null | boolean;
  invoiceTotal: number;
}
