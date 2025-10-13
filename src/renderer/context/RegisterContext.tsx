import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";
import { ClientData } from "../../interfaces/app";

interface RegisterContextType {
  isRegistered: boolean;
  setIsRegistered: (value: boolean) => void;
  ClientData: ClientData | null;
  setClientData: (data: ClientData | null) => void;
}

const RegisterContext = createContext<RegisterContextType | undefined>(
  undefined
);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [ClientData, setClientData] = useState<ClientData | null>(null);

  return (
    <RegisterContext.Provider
      value={{ isRegistered, setIsRegistered, ClientData, setClientData }}
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
