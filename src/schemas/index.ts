import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

export const createInvoiceValidationSchema = toTypedSchema(
  zod.object({
    billerStreetAddress: zod
      .string({ required_error: "street is required" })
      .min(1, { message: "street is required" }),
    billerCity: zod
      .string({ required_error: "city is required" })
      .min(1, { message: "city is required" }),
    billerZipCode: zod
      .string({ required_error: "zip code is required" })
      .min(1, { message: "zip code is required" }),
    billerCountry: zod
      .string({ required_error: "country is required" })
      .min(1, { message: "country is required" }),
    clientName: zod
      .string({ required_error: "client name is required" })
      .min(1, { message: "client name is required" }),
    clientEmail: zod
      .string({ required_error: "email is required" })
      .min(1, { message: "client email is required" })
      .email({ message: "invalid  email" }),
    clientStreetAddress: zod
      .string({ required_error: "street is required" })
      .min(1, { message: "street is required" }),
    clientCity: zod
      .string({ required_error: "city is required" })
      .min(1, { message: "city is required" }),
    clientZipCode: zod
      .string({ required_error: "zip code is required" })
      .min(1, { message: "zip code is required" }),
    clientCountry: zod
      .string({ required_error: "country is required" })
      .min(1, { message: "country is required" }),
    productDescription: zod
      .string({ required_error: "product description is required" })
      .min(1, { message: "product description is required" }),
    invoicePending: zod.boolean().nullable(),
    invoiceDraft: zod.boolean().nullable(),
    invoicePaid: zod.boolean().nullable(),
    invoiceDate: zod.date(),
    paymentDueDate: zod.date().nullable(),
    paymentTerms: zod.object(
      {
        days: zod.string(),
        value: zod.number(),
      },
      { required_error: "select payment terms" }
    ),
    invoiceTotal: zod.number().nullable(),
  })
);
