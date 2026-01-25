import { OrderStatus } from "@/main/models/Order/OrderStatusModel";
import OrderType from "@/main/models/Order/OrderTypeModel";
import { BiSolidDish } from "react-icons/bi";
import { FaHandHoldingMedical } from "react-icons/fa6";
import { GiCancel } from "react-icons/gi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineDeliveryDining, MdTableRestaurant } from "react-icons/md";
import { PiCookingPotBold } from "react-icons/pi";
import { RiRestaurantLine } from "react-icons/ri";

export const iconCardOrder: Record<OrderType | string, React.ElementType> = {
  ONSITE: MdTableRestaurant,
  DELIVERY: MdOutlineDeliveryDining,
  CARRY: FaHandHoldingMedical,
};

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
