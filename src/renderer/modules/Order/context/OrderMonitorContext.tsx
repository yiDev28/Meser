import { ChildrenProps, TypeMsg } from "@/interfaces/app";
import { OrderDTO } from "@/interfaces/order";

import { getErrorMessage } from "@/utils/errorUtils";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

// Definimos la estructura del contexto
interface OrderMonitorContextProps {
  orders: OrderDTO[];
  setOrders: React.Dispatch<React.SetStateAction<OrderDTO[]>>;
  alert: TypeMsg | null;
  //refreshOrders: () => Promise<void>;
}

// Creamos el contexto con un valor inicial nulo.
const OrderMonitorContext = createContext<OrderMonitorContextProps | undefined>(
  undefined
);



// El proveedor del contexto, que contiene la lógica principal
export const OrderMonitorProvider: React.FC<ChildrenProps> = ({
  children,
}) => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [alert, setAlert] = useState<TypeMsg | null>(null);

  // Función para llamar al IPC handler y obtener las órdenes
  const fetchOrders = async () => {
    try {
      const response = await window.electron.getOrdersPanel();
      console.log(response);
      if (response.code === 0) {
        setOrders(response.data);
        if (response.data.length > 0) {
          setAlert(null);
          return;
        }
        setAlert({ type: "INFO", msg: "No hay ordenes pendientes." });
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: `Error inesperado sincronizando ordenes ||| ${getErrorMessage(
          error
        )}`,
      });
    }
  };

  useEffect(() => {
    fetchOrders();
    const refreshInterval = setInterval(() => {
      fetchOrders();
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, []);

  const value = {
    orders,
    setOrders,
    alert,
    //refreshOrders: fetchOrders,
  };

  return (
    <OrderMonitorContext.Provider value={value}>
      {children}
    </OrderMonitorContext.Provider>
  );
};

// Custom hook para consumir el contexto de manera sencilla
export const useOrdersPanel = (): OrderMonitorContextProps => {
  const context = useContext(OrderMonitorContext);
  if (!context) {
    throw new Error("useOrders debe ser usado dentro de OrderMonitorProvider");
  }
  return context;
};
