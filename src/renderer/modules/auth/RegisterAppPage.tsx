import { ButtonGeneric } from "../../components/Buttons/ButtonGeneric";
import { useRegisterApp } from "./hooks/useRegisterApp";

const RegisterAppPage: React.FC = () => {
  const { form, handleChange, handleSubmit } = useRegisterApp();
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-light">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-neutral-dark">
          Registro Cliente
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ID Cliente */}
          <div>
            <label
              htmlFor="idClient"
              className="block text-sm font-medium text-neutral-dark mb-1"
            >
              Id Cliente
            </label>
            <input
              type="text"
              id="idClient"
              name="idClient"
              value={form.idClient}
              onChange={handleChange}
              required
              className="w-full border border-neutral-gray rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Serial Cliente */}
          <div>
            <label
              htmlFor="keyClient"
              className="block text-sm font-medium text-neutral-dark mb-1"
            >
              Serial Cliente
            </label>
            <input
              type="text"
              id="keyClient"
              name="keyClient"
              value={form.keyClient}
              onChange={handleChange}
              required
              className="w-full border border-neutral-gray rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Botón */}
          <ButtonGeneric mode={"primary"} label="Registrar" type="submit" />
        </form>
      </div>
    </div>
  );
};

export default RegisterAppPage;
