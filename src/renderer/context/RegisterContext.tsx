import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ClientData } from "../../interfaces/app";

interface RegisterContextType {
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
  clientData: ClientData | null;
  setClientData: (data: ClientData | null) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [clientData, setClientData] = useState<ClientData | null>(null);

  useEffect(() => {
    const storedClientData = localStorage.getItem("clientData");
    if (storedClientData) {
      setClientData(JSON.parse(storedClientData));
      setIsRegistered(true);
    }
  }, []);

  return (
    <RegisterContext.Provider
      value={{ isRegistered, setIsRegistered, clientData, setClientData }}
    >
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister debe usarse dentro de un RegisterProvider");
  }
  return context;
};
