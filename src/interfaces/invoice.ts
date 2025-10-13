import { CustomerDTO } from "./customer";

export interface InvoiceItemsDTO {
  id: number;
  invoiceId: number;
  productId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  notes: string;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface InvoiceDTO {
  id: number;
  number: number;
  order: number;
  customer: CustomerDTO;
  subtotal: number;
  tip: number;
  tax: number;
  total: number;
  paymentMethod: number;
  currency: number;
  items: InvoiceItemsDTO[];
}
