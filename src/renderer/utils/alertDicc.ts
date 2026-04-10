export const alertDicc: Record<string, {title:string, background: string; text: string }> = {
  SUCCESS: {
    title:"Exitoso",
    background: "var(--color-success-light)",
    text: "var(--color-success)",
  },
  ERROR: {
    title:"Error",
    background: "var(--color-error-light)",
    text: "var(--color-error)",
  },
  WARNING: {
    title:"Advertencia",
    background: "var(--color-warning-light)",
    text: "var(--color-warning)",
  },
  INFO: {
    title:"Información",
    background: "var(--color-info-light)",
    text: "var(--color-info)",
  },
  NEUTRO: {
    title:"Información",
    background: "var(color-neutral-light)",
    text: "var(--color-neutral-gray)",
  },

};
