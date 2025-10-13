import { useState } from "react";
import { LoginClient } from "../../../../interfaces/app";
import { useLoading } from "../../../context/LoadingContext";
import { useRegister } from "../../../context/RegisterContext";
import { defaultAlert } from "../../../components/Modals/AlertService";
import { getErrorMessage } from "../../../../utils/errorUtils";

export const useRegisterApp = () => {
  const { setLoading } = useLoading();
  const { setIsRegistered, setClientData } = useRegister();
  const [form, setForm] = useState<LoginClient>({
    idClient: "10999",
    keyClient: "asd321",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    registerApp();
  };

  const registerApp = async () => {
    setLoading(true);
    try {
      const res = await window.electron.registerApp(form);
      if (res.code !== 0) {
        defaultAlert({
          mode: "warning",
          body: `${res.msg}`,
          successButton: true,
        });
        return;
      }
      defaultAlert({
        mode: "success",
        body: "Cliente registrado correctamente",
        title: "Registro exitoso",
        successButton: true,
      });
      setIsRegistered(true);
      setClientData(res.data ?? null);
    } catch (error) {
      defaultAlert({
        mode: "error",
        title: "Error inesperado",
        body: `Error al registrar la aplicacion: ${getErrorMessage(error)}`,
        successButton: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleSubmit,
  };
};
