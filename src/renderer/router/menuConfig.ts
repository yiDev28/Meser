import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import {  MdOutlineDashboardCustomize } from "react-icons/md";
import { TbCashRegister } from "react-icons/tb";
import { FaCashRegister } from "react-icons/fa6";


export const menuAppItems = [
  { label: "Panel Ordenes", path: "/order-panel", icon: MdOutlineDashboardCustomize   },
  { label: "Ventas", path: "/sales", icon: TbCashRegister  },
  { label: "Facturas", path: "/invoices", icon: LiaFileInvoiceDollarSolid  },
  { label: "Flujo de caja", path: "/cash-flow", icon: FaCashRegister  },
];
