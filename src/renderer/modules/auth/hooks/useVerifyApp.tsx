import { useEffect } from "react";
import { useLoading } from "../../../context/LoadingContext";
import { useRegister } from "../../../context/RegisterContext";
import { defaultAlert } from "../../../components/Modals/AlertService";
import { getErrorMessage } from "../../../../utils/errorUtils";
import {  } from "../../../../interfaces/app";

export const useVerifyApp = () => {
  const { isRegistered, setIsRegistered, setClientData } = useRegister();
  const { setLoading } = useLoading();

  useEffect(() => {
    verifyRegister();
  }, []);

  const verifyRegister = async () => {
    setLoading(true);
    try {
      const res = await window.electron.verifyRegisterApp();
      if (res.code === 0) {
        setIsRegistered(true);
        setClientData(res.data ?? null);
        localStorage.setItem("clientData", JSON.stringify(res.data));
      } else {
        setIsRegistered(false);
        defaultAlert({
          mode: "warning",
          title: "Aplicación no registrada",
          body: res.msg,
          successButton: true,
        });
      }
    } catch (error) {
      defaultAlert({
        mode: "error",
        title: "Error inesperado",
        body: `Error al verificar la aplicación: ${getErrorMessage(error)}`,
        successButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegistered,
  };
};
