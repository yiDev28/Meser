import React from "react";
import { useLogin } from "./hooks/useLogin";
import { InputGeneric } from "@/renderer/components/Inputs/InputGeneric";
import { FaUserAlt } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { BiLogIn } from "react-icons/bi";
import { ButtonGeneric } from "@/renderer/components/Buttons/ButtonGeneric";
import { IoExit } from "react-icons/io5";

const LoginPage: React.FC = () => {
  const {
    form,
    handleChange,
    handleSubmit,
    clientData,
    logoClient,
    handleExit,
    errors,
  } = useLogin();

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutro/40">
      <div className=" w-4/5 xl:w-4/6 grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-lg ">
        <div className="bg-background gap-6 flex md:flex-col items-center w-full md:h-full h-20 rounded-l-2xl justify-center md:p-10 p-20">
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-center text-secondary ">
              Bienvenido!
            </h2>
            <h3 className="text-2xl font-bold text-center text-neutral-dark  ">
              {clientData?.nameClient}
            </h3>
          </div>
          <img
            src={`${clientData?.logoPath || logoClient || ""}`}
            alt={`Logo ${clientData?.nameClient || "cliente"}`}
            className="md:w-60 w-35 h-auto"
            onError={(e) => {
              e.currentTarget.src = "/electron-vite.animate.svg";
            }}
          />
        </div>

        <div className="bg-neutral-light p-10 w-full h-full rounded-r-2xl flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-10 text-primary">
            Inicio sesión
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Usuario */}
            <InputGeneric
              label="Usuario"
              name="userClient"
              value={form.userClient}
              onChange={handleChange}
              required
              icon={FaUserAlt}
              placeholder="usuario.admin"
              error={errors.userClient}
            />

            {/* Contraseña */}
            <InputGeneric
              label="Contraseña"
              name="passClient"
              type="password"
              value={form.passClient}
              onChange={handleChange}
              required
              icon={MdOutlinePassword}
              placeholder="********"
              error={errors.passClient}
            />
            <div className="mt-8 flex justify-around gap-4">
              {/* Botón */}
              <ButtonGeneric
                mode="info"
                label="Salir"
                type="button"
                size="lg"
                iconPosition="left"
                icon={IoExit}
                onClick={handleExit}
              />

              <ButtonGeneric
                mode="primary"
                label="Ingresar"
                type="submit"
                size="lg"
                iconPosition="right"
                icon={BiLogIn}
              />
            </div>
          </form>
        </div>
      </div>
    </div>

    // <div className="flex items-center justify-center min-h-screen bg-neutro/40">
    //   <div className="bg-background px-8 py-12 rounded-lg shadow-2xl w-full max-w-sm">
    //     <h2 className="text-2xl font-bold text-center mb-2">
    //       Bienvenido
    //     </h2>

    //     <h2 className="text-2xl font-bold text-center mb-6">
    //       Inicio de sesión
    //     </h2>

    //   </div>
    // </div>
  );
};

export default LoginPage;
