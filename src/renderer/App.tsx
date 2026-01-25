import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { Navigation } from "./router/Navigation";
import {  useAlertService } from "./components/Modals/AlertService";
import { useVerifyApp } from "./modules/auth/hooks/useVerifyApp";
import RegisterAppPage from "./modules/auth/RegisterAppPage";

const App: React.FC = () => {
  const { isRegistered } = useVerifyApp();
  // useEffect(() => {
  //   window.electron.onUdateAvailable(() => {
  //     console.log("Update available");
  //     defaultAlert({
  //       mode: "info",
  //       title: "Actualización disponible",
  //       body: "Una nueva versión de la aplicación está disponible. La descarga comenzará en breve.",
  //       successButton: false,
  //     });
  //   }
  //   );
  //   window.electron.onUdateDownloaded(() => {
  //     console.log("Update downloaded");
  //     defaultAlert({
  //       mode: "success",
  //       title: "Actualización descargada",
  //       body: "La actualización se ha descargado. La aplicación se reiniciará para aplicar la actualización.",
  //       successButton: true,
  //       onSuccess: () => {  
  //         window.electron.restartApp();
  //       },
  //     });
  //   });
  // }, []);
  return (
    <>
      {useAlertService()}

      {isRegistered ? (
        <AuthProvider>
          <Navigation />
        </AuthProvider>
      ) : (
        <RegisterAppPage />
      )}
    </>
  );
};

export default App;
