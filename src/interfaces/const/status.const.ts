export const STATUS_ENUM = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED',
  PENDING: 'PENDING',
} as const;

export type StatusType = typeof STATUS_ENUM[keyof typeof STATUS_ENUM];


export const STATUS_TAB_ENUM = {
  FREE: 'FREE',
  OCCUPIED: 'OCCUPIED',
  RESERVED: 'RESERVED',
} as const;

export type StatusTabType = typeof STATUS_TAB_ENUM[keyof typeof STATUS_TAB_ENUM];