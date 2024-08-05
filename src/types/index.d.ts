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

interface InvoiceType {
  id: string;
  invoiceId: string;
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
  invoiceDate: { nanoseconds: number; seconds: number };
  paymentTerms: { days: string; value: number };
  paymentDueDate: { nanoseconds: number; seconds: number };
  productDescription: string;
  invoicePending: boolean;
  invoiceDraft: boolean;
  invoicePaid: boolean;
  invoiceTotal: number;
  invoiceItemList: InvoiceItemType[];
}
