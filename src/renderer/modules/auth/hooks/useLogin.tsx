import { useState } from "react";
import { LoginUser } from "../../../../interfaces/app";
import { useLoading } from "../../../context/LoadingContext";
import { defaultAlert } from "../../../components/Modals/AlertService";
import { useAuth } from "../../../context/AuthContext";
import { useRegister } from "../../../context/RegisterContext";
import { getErrorMessage } from "../../../../utils/errorUtils";

export const useLogin = () => {
  const { setLoading } = useLoading();
  const { ClientData } = useRegister();
  const { setIsAuthenticated, setToken, setUser,user } = useAuth();
  const [form, setForm] = useState<LoginUser>({
    idClient: ClientData?.idClient || "",
    userClient: "yiduard.bolivar",
    passClient: "admin",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        userId:res.data.userId,
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
    user
  };
};
