import { useState } from "react";
import { LoginUser } from "../../../../interfaces/app";
import { useLoading } from "../../../context/LoadingContext";
import { defaultAlert } from "../../../components/Modals/AlertService";
import { useAuth } from "../../../context/AuthContext";
import { useRegister } from "../../../context/RegisterContext";
import { getErrorMessage } from "../../../../utils/errorUtils";
import { useApp } from "@/renderer/hooks/useApp";
import { FormErrorsLogin } from "@/interfaces/types/errors.type";
import {
  validateErrorsOrUndefined,
  validateField,
  VALIDATORS,
} from "@/renderer/utils/validators";

export const useLogin = () => {
  const { handleExit } = useApp();
  const { setLoading } = useLoading();
  const { clientData } = useRegister();
  const { setIsAuthenticated, setToken, setUser, user } = useAuth();
  const [logoClient] = useState<string>(clientData?.logoPath || "");

  const [form, setForm] = useState<LoginUser>({
    idClient: clientData?.idClient || "",
    userClient: "yiduard.bolivar",
    passClient: "adminadmin",
  });
  const [errors, setErrors] = useState<FormErrorsLogin>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = (): boolean => {
    const newErrors = validateErrorsOrUndefined<FormErrorsLogin>({
      userClient: validateField(form.userClient, VALIDATORS.USER),
      passClient: validateField(form.passClient, VALIDATORS.PASSWORD),
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    //se validan datos
    loginUser();
  };

  const loginUser = async () => {
    setLoading(true);
    try {
      const res = await window.electron.loginUser(form);
      console.log("Login response:", res);
      if (res.code !== 0) {
        defaultAlert({
          mode: "warning",
          body: `${res.msg}`,
          successButton: true,
        });
        return;
      }

      setIsAuthenticated(true);
      setToken(res.data?.token || "");
      setUser({
        username: form.userClient,
        role: res.data.role,
        userId: res.data.userId,
      });
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
    user,
    clientData,
    logoClient,
    handleExit,
    errors,
  };
};
