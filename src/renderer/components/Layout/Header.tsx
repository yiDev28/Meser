import { ModalNewOrder } from "@/renderer/modules/Order/components/ModalNewOrder";
import { useNewOrder } from "@/renderer/modules/Order/hooks/useNewOrder";
import { IoHomeOutline } from "react-icons/io5";
import { RiStickyNoteAddLine } from "react-icons/ri";
export default function Header() {
  const { openModalNewOrder, closeModalNewOrder, openModalNew } = useNewOrder();
  return (
    <div className="flex items-center flex-shrink-0 h-16 px-8 bg-primary">
      <h1 className="text-lg font-medium">Monitor</h1>
      <button
        className="flex items-center justify-center h-10 px-4 ml-auto text-sm font-medium rounded hover:bg-gray-300"
        onClick={openModalNewOrder}
      >
        Nueva Orden
        <RiStickyNoteAddLine className="ml-2" />
      </button>
      <button className="flex items-center justify-center h-10 px-4 ml-2 text-sm font-medium bg-gray-200 rounded hover:bg-gray-300">
        Action 2
      </button>
      <button className="relative ml-2 text-sm focus:outline-none group">
        <div className="flex items-center justify-between w-10 h-10 rounded hover:bg-gray-300">
          <IoHomeOutline />
        </div>
        <div className="absolute right-0 flex-col items-start hidden w-40 pb-1 bg-white border border-gray-300 shadow-lg group-focus:flex">
          <a className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">
            Menu Item 1
          </a>
          <a className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">
            Menu Item 1
          </a>
          <a className="w-full px-4 py-2 text-left hover:bg-gray-300" href="#">
            Menu Item 1como
          </a>
        </div>
      </button>
      <ModalNewOrder isOpen={openModalNew} onClose={closeModalNewOrder} />
    </div>
  );
}
