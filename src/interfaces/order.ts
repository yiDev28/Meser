import { GuestCustomerDTO } from "./customer";
import { ProductDTO } from "./product";
import { TableDTO } from "./table";

// Item Status DTO
export interface ItemStatusDTO {
  id: number;
  name: string;
  description: string;
  sequence: number;
  paramStatus: string;
}

// Order Item DTO
export interface OrderItemDTO {
  id: string;
  localId: number;
  quantity: number;
  notes: string;
  menuItem: MenuItemDTO;
  itemStatus: ItemStatusDTO;
}

export interface MenuDTO {
  id: number;
  name: string;
  menuItems: MenuItemDTO[];
}
export interface MenuItemDTO {
  id: number;
  menuId: number;
  product: ProductDTO;
  price: string;
}

// Order Type DTO
export interface OrderTypeDTO {
  id: number;
  description: string;
  name: string;
  colorLabel: string;
  paramType: string;
  parameters: OrderTypeParamsDTO[];
}

// Order Status DTO
export interface OrderStatusDTO {
  id: number;
  name: string;
  description: string;
  sequence: number;
  paramPanel: boolean;
  paramStatus: string;
}

export interface OrderTypeParamsDTO {
  id: number;
  value: string;
  valueType: string;
  definition: OrderChargeDefinitionDTO;
}

interface OrderChargeDefinitionDTO {
  id: number;
  code: string;
  name: string;
  description: string;
}

// Order DTO (principal)
export interface OrderDTO {
  id: string;
  localNumber: number;
  customerId: number;
  total: number;
  totalV: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  type: OrderTypeDTO;
  guestCustomer?: GuestCustomerDTO;
  orderStatus: OrderStatusDTO;
  table: TableDTO;
  items: OrderItemDTO[];
  metadataOrder: OrderMetadataDTO[];
}

export interface OrderMetadataDTO {
  nameCustomer?: string;
  notesOrder?: string;
}
//Order Creation DTO
export interface CreateOrderDTO {
  customerId: number;
  orderType: number;
  tableId?: number;
  name?: string;
  address?: string;
  codCity?: number;
  phone?: string;
  notes?: string;
  userId: number;
  items: {
    menuItemId: number;
    quantity: number;
    notes?: string;
  }[];
}

export interface OrderChanges {
  codeParam: number;
  total: number;
}



export interface DefaultParams {
  status: boolean;
  default: number;
}
export interface TypePaymentDTO {
  id: number;
  code: string;
  name: string;
  description?: string;
  affectsCash?: boolean;
}
export interface TypePaymentObjDTO extends DefaultParams {
  paymentsTypes?: TypePaymentDTO[];
}

export interface ConfigInvoicedDTO extends DefaultParams{}


