import { ChildrenProps, TypeMsg } from "@/interfaces/app";
import { InvoiceDTO } from "@/interfaces/invoice";
import { getErrorMessage } from "@/utils/errorUtils";
import { createContext, useContext, useEffect, useState } from "react";

// Definimos la estructura del contexto
interface InvoiceContextProps {
  invoices: InvoiceDTO[];
  setInvoices: React.Dispatch<React.SetStateAction<InvoiceDTO[]>>;
  alert: TypeMsg | null;
  //refreshOrders: () => Promise<void>;
}

// Creamos el contexto con un valor inicial nulo.
const InvoiceContext = createContext<InvoiceContextProps | undefined>(
  undefined
);

// El proveedor del contexto, que contiene la lógica principal
export const InvoiceProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
  const [alert, setAlert] = useState<TypeMsg | null>(null);

  // Función para llamar al IPC handler y obtener las órdenes
  const fetchInvoices = async () => {
    try {
      const response = await window.electron.getInvoices();
      console.log(response);
      if (response.code === 0) {
        setInvoices(response.data);
        if (response.data.length > 0) {
          setAlert(null);
          return;
        }
        setAlert({ type: "INFO", msg: "No se encontraron facturas" });
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: `Error inesperado sincronizando facturas ||| ${getErrorMessage(
          error
        )}`,
      });
    }
  };

  useEffect(() => {
    fetchInvoices();
    const refreshInterval = setInterval(() => {
      fetchInvoices();
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, []);

  const value = {
    invoices,
    setInvoices,
    alert,
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};

// Custom hook para consumir el contexto de manera sencilla
export const useInvoice = (): InvoiceContextProps => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice debe ser usado dentro de InvoiceProvider");
  }
  return context;
};
