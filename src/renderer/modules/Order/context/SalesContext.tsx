import { ChildrenProps, TypeMsg } from "@/interfaces/app";
import { OrderDTO } from "@/interfaces/order";
import { getErrorMessage } from "@/utils/errorUtils";
import { createContext, useContext, useEffect, useState } from "react";

//Definimos la estructura del contexto
interface SalesContextProps {
  orders: OrderDTO[];
  setOrders: React.Dispatch<React.SetStateAction<OrderDTO[]>>;
  selectedOrder: OrderDTO | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<OrderDTO | null>>;
  alert: TypeMsg | null;
  //refreshOrders: () => Promise<void>;
}

//se crea el contexto
const SalesConstext = createContext<SalesContextProps | undefined>(undefined);

//proveedor de contexto con su logica
// El proveedor del contexto, que contiene la lógica principal
export const SalesProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDTO | null>(null);

  const [alert, setAlert] = useState<TypeMsg | null>(null);

  // Función para llamar al IPC handler y obtener las órdenes
  const fetchOrders = async () => {
    try {
      const response = await window.electron.getOrdersSales();
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
        msg: `Error inesperado sincronizando ubicaciones ||| ${getErrorMessage(
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
    selectedOrder,
    setSelectedOrder,
    alert,
    //refreshOrders: fetchOrders,
  };

  return (
    <SalesConstext.Provider value={value}>{children}</SalesConstext.Provider>
  );
};

// Custom hook para consumir el contexto de manera sencilla
export const useOrdersSales = (): SalesContextProps => {
  const context = useContext(SalesConstext);
  if (!context) {
    throw new Error("useOrders debe ser usado dentro de OrderMonitorProvider");
  }
  return context;
};
