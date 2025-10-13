import { useAuth } from "../context/AuthContext";
import { ParamOrderProvider } from "../context/ParamOrderContext";
import LoginPage from "../modules/auth/LoginPage";
import { LoggedNavigation } from "./LoggedNavigation";

export function Navigation() {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {!isAuthenticated ? (
        <LoginPage />
      ) : (
        <ParamOrderProvider>
          <LoggedNavigation />
          
        </ParamOrderProvider>
      )}
    </>
  );
}
