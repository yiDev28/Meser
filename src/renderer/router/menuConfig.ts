import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdDashboard } from "react-icons/md";
import { TbCashRegister } from "react-icons/tb";
import { FaCashRegister } from "react-icons/fa6";
import { MdSync } from "react-icons/md";


export const menuAppItems = [
  { label: "Panel Ordenes", path: "/order-panel", icon: MdDashboard   },
  { label: "Ventas", path: "/sales", icon: TbCashRegister  },
  { label: "Facturas", path: "/invoices", icon: LiaFileInvoiceDollarSolid  },
  { label: "Flujo de caja", path: "/cash-flow", icon: FaCashRegister  },
  { label: "Sincronización", path: "/sync", icon: MdSync  },
];
