import { ModalNewOrder } from "@/renderer/modules/Order/components/ModalNewOrder";
import { useNewOrder } from "@/renderer/modules/Order/hooks/useNewOrder";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { useLogin } from "@/renderer/modules/auth/hooks/useLogin";
import { ButtonGeneric } from "../Buttons/ButtonGeneric";

export default function Header() {
  const newOrder = useNewOrder();
  const { clientData, logoClient } = useLogin();
  return (
    <div className="flex items-center justify-between flex-shrink-0 h-16 px-4 ">
      <div className="flex items-center">
        <ButtonGeneric
          label="Nueva Orden"
          onClick={newOrder.openModalNewOrder}
          icon={RiStickyNoteAddLine}
          mode="light"
          size="lg"
          iconPosition="right"
        />
      </div>
      <div className="flex items-center rounded-md  px-3 gap-3">
        <div>
          <h2 className="text-neutral-light font-bold text-xl">
            {clientData?.nameClient}{" "}
          </h2>
        </div>
        <div className="flex items-center bg-background my-1 rounded-md py-1 ">
          <img
            src={`${clientData?.logoPath || logoClient || ""}`}
            alt={`Logo ${clientData?.nameClient || "cliente"}`}
            width={50}
            onError={(e) => {
              e.currentTarget.src = "/electron-vite.animate.svg";
            }}
          />
        </div>
      </div>
      <ModalNewOrder isOpen={newOrder.openModalNew} newOrder={newOrder} />
    </div>
  );
}
