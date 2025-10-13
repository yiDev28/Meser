import { ChildrenProps, TypeMsg } from "@/interfaces/app";
import { MenuDTO, OrderTypeDTO } from "@/interfaces/order";
import { getErrorMessage } from "@/utils/errorUtils";
import React, { createContext, useContext, useEffect, useState } from "react";
interface ParamOrderContextProps {
  orderType: OrderTypeDTO[];
  menu: MenuDTO | undefined;
  alert: TypeMsg | null;
}

// Creamos el contexto con un valor inicial nulo.
const ParamOrderContext = createContext<ParamOrderContextProps | undefined>(
  undefined
);

export const ParamOrderProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [orderType, setOrderType] = useState<OrderTypeDTO[]>([]);
  const [menu, setMenu] = useState<MenuDTO>();

  const [alert, setAlert] = useState<TypeMsg | null>(null);

  const fetchOrderType = async () => {
    try {
      const response = await window.electron.getTypeOrder();
      console.log(response);
      if (response.code === 0) {
        setOrderType(response.data);
        setAlert(null);
      } else {
        setAlert({ type: "WARNING", msg: response.message });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: `Error inesperado sincronizando tipos de ordenes ||| ${getErrorMessage(
          error
        )}`,
      });
    }
  };

  const fetchMenu = async () => {
    try {
      const response = await window.electron.getMenu();
      console.log(response);
      if (response.code === 0) {
        setMenu(response.data);
        setAlert(null);
      } else {
        setAlert({ type: "WARNING", msg: response.message });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: `Error inesperado sincronizando el menu||| ${getErrorMessage(
          error
        )}`,
      });
    }
  };

  useEffect(() => {
    fetchOrderType();
    fetchMenu();
  }, []);

  const value = {
    orderType,
    menu,
    alert,
  };
  return (
    <ParamOrderContext.Provider value={value}>
      {children}
    </ParamOrderContext.Provider>
  );
};

// Custom hook para consumir el contexto de manera sencilla
export const useParamOrder = (): ParamOrderContextProps => {
  const context = useContext(ParamOrderContext);
  if (!context) {
    throw new Error(
      "useParamOrder debe ser usado dentro de ParamOrderProvider"
    );
  }
  return context;
};
