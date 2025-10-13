import { CreateOrderDTO } from "@/interfaces/order";
import { defaultAlert } from "@/renderer/components/Modals/AlertService";
import { useState } from "react";

export const useNewOrder = () => {
  const [openModalNew, setOpenModalNew] = useState<boolean>(false);

  const openModalNewOrder = () => {
    setOpenModalNew(true);
  };

  const closeModalNewOrder = () => {
    setOpenModalNew(false);
  };

  const createOrder = async (order: CreateOrderDTO) => {

    //SE DEBE VALIDAR ALGO ???????
    
    console.log(order)
    const res = await window.electron.createOrder(order);

    console.log(res);

    if (res.code !== 0) {
      defaultAlert({
        mode: "warning",
        body: `${res.msg}`,
        successButton: true,
      });
     return
    }
     defaultAlert({
        mode: "success",
        body: `EXitosooooooooooooo`,
        successButton: true,
      });
  };

  return { openModalNewOrder, closeModalNewOrder, openModalNew, createOrder };
};
