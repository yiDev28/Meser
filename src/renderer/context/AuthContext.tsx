// src/renderer/contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { UserInterface } from "../../interfaces/user";

// Tipos para el usuario y el contexto

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  token: string | null;
  setToken: (value: string) => void;
  user: UserInterface | null;
  setUser: (user: UserInterface | null) => void;
  logout: () => void;
}

// Crea el contexto con valores por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserInterface | null>(null);

  useEffect(() => {
    if ( token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem("authToken");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    console.log("Sesión cerrada");
  };

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    token,
    setToken,
    user,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto de autenticación fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
