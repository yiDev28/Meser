import { CustomerDTO } from "./customer";

export interface InvoiceItemsDTO {
  id: string;
  invoiceId: string;
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
  id: string;
  number: number;
  order: string;
  customer: CustomerDTO;
  subtotal: number;
  tip: number;
  tax: number;
  total: number;
  paymentMethod: number;
  currency: number;
  items: InvoiceItemsDTO[];
}

export interface ChargeInvoiceDTO {
  paramChargeId: number;
  paramChargeCode: string;
  total: number;
}

export interface CreateInvoiceDTO {
  orderId: string;
  customerId?: number;
  paymentMethod: number;
  cashRegisterId?: string;
  userId: number;
  charges: ChargeInvoiceDTO[];
  discounts: number;
  electronicInvoice: boolean;
}

export interface InvoiceListDTO {
  id: string;
  number: string;
  total: number;
  subtotal: number;
  tax: number;
  paymentMethodId: number;
  orderId: string;
  orderTypeId: number;
  createdAt: string;
  itemsCount: number;
}

export interface InvoiceItemDTO {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface InvoiceDetailDTO extends InvoiceListDTO {
  items: InvoiceItemDTO[];
  cashRegisterId?: string;
  userId: number;
}

export interface PaymentSummary {
  paymentMethodId: number;
  paymentMethodName: string;
  count: number;
  total: number;
}

export interface OrderTypeSummary {
  orderTypeId: number;
  orderTypeName: string;
  orderTypeColor: string;
  count: number;
  total: number;
}