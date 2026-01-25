export const ORDER_TYPE = {
  ONSITE: "ONSITE",
  DELIVERY: "DELIVERY",
  CARRY: "CARRY",
} as const;

export type OrderType = typeof ORDER_TYPE[keyof typeof ORDER_TYPE];

export const ORDER_STATUS = {
  PENDING: "PENDING",
  PREPARATION: "PREPARATION",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
  INVOICED: "INVOICED",
} as const;




export type OrderStatus =
  typeof ORDER_STATUS[keyof typeof ORDER_STATUS];