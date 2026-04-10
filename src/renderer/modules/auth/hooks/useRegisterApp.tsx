import { useState } from "react";
import { LoginClient } from "../../../../interfaces/app";
import { useLoading } from "../../../context/LoadingContext";
import { useRegister } from "../../../context/RegisterContext";
import { defaultAlert } from "../../../components/Modals/AlertService";
import { getErrorMessage } from "../../../../utils/errorUtils";
import { useApp } from "@/renderer/hooks/useApp";
import {
  validateErrorsOrUndefined,
  validateField,
  VALIDATORS,
} from "@/renderer/utils/validators";
import { FormErrorsRegister } from "@/interfaces/types/errors.type";

export const useRegisterApp = () => {
  const { handleExit } = useApp();
  const { setLoading } = useLoading();
  const { setIsRegistered, setClientData } = useRegister();
  const [form, setForm] = useState<LoginClient>({
    idClient: "16e12c95-e2ab-4427-8f38-1f27f7835495",
    keyClient: "asd321I5QmU711EBfUodmotfMdW6Ly",
  });
  const [errors, setErrors] = useState<FormErrorsRegister>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    registerApp();
  };

  const validateForm = (): boolean => {
    const newErrors = validateErrorsOrUndefined<FormErrorsRegister>({
      idClient: validateField(form.idClient, VALIDATORS.ID_CLIENT),
      keyClient: validateField(form.keyClient, VALIDATORS.TOKEN),
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
      localStorage.setItem("clientData", JSON.stringify(res.data));
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
    errors,
    handleChange,
    handleSubmit,
    handleExit,
  };
};
