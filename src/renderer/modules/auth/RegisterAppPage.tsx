import { InputGeneric } from "@/renderer/components/Inputs/InputGeneric";
import { ButtonGeneric } from "../../components/Buttons/ButtonGeneric";
import { useRegisterApp } from "./hooks/useRegisterApp";
import { BiLogIn, BiLogOut } from "react-icons/bi";
import { HiIdentification } from "react-icons/hi2";
import { MdPassword } from "react-icons/md";
import { IoExit } from "react-icons/io5";

const RegisterAppPage: React.FC = () => {
  const { form, handleChange, handleSubmit, errors, handleExit } =
    useRegisterApp();
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutro/40">
      <div className=" w-4/5 xl:w-4/6 grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-lg">
        <div className="bg-background flex items-center w-full md:h-full h-20 rounded-l-2xl justify-center md:p-0 p-20">
          <img src="/logo_meser.png" alt="Logo Meser" />
        </div>

        <div className="bg-neutral-light p-10 w-full h-full rounded-r-2xl flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-center mb-10 text-secondary">
            Registro Cliente
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID Cliente */}
            <InputGeneric
              label="Id Cliente"
              type="text"
              id="idClient"
              name="idClient"
              value={form.idClient}
              onChange={handleChange}
              icon={HiIdentification}
              placeholder="xxxx-xxxxx-xxx-xxxxxx-xxxx"
              size="lg"
              error={errors.idClient}
            />

            {/* Serial Cliente */}
            <InputGeneric
              label="Token Cliente"
              type="password"
              id="keyClient"
              name="keyClient"
              value={form.keyClient}
              onChange={handleChange}
              icon={MdPassword}
             placeholder="xxxxxxxxxxxxxxxxx"
              size="lg"
              error={errors.keyClient}
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
                label="Registrar"
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
  );
};

export default RegisterAppPage;
