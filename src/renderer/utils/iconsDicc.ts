import { OrderStatus } from "@/main/models/Order/OrderStatusModel";
import OrderType from "@/main/models/Order/OrderTypeModel";
import { BiSolidDish } from "react-icons/bi";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineDeliveryDining, MdTableRestaurant } from "react-icons/md";
import { PiCookingPotBold } from "react-icons/pi";
import { RiRestaurantLine } from "react-icons/ri";


//DEFINICION DE ICONOS PARA TIPOS DE ORDEN Y ESTADOS DE ORDEN
export const iconCardOrder: Record<OrderType | string, React.ElementType> = {
  ONSITE: MdTableRestaurant,
  DELIVERY: MdOutlineDeliveryDining,
  CARRY: FaHandHoldingMedical,
};

//DEFINICION DE ICONOS PARA ESTADOS DE ORDEN Y UN COLOR ASOCIADO PARA CADA ESTADO
export const iconItemOrder: Record<
  OrderStatus | string,
  { icon: React.ElementType; color: string }
> = {
  PENDING: {
    icon: BiSolidDish,
    color: "var(--color-neutro)",
  },
  PREPARATION: {
    icon: PiCookingPotBold,
    color: "var(--color-quaternary)",
  },
  DELIVERED: {
    icon: RiRestaurantLine,
    color: "var(--color-success)",
  },
  CANCELED: {
    icon: GiCancel,
    color: "var(--color-error)",
  },
  INVOICED: {
    icon: LiaFileInvoiceDollarSolid,
    color: "var(--color-info)",
  },
};
