export const SCOPE_ENUM = {
  GLOBAL: "GLOBAL",
  CLIENT: "CLIENT",
} as const;

export type ScopeType = typeof SCOPE_ENUM[keyof typeof SCOPE_ENUM];
