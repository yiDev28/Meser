import React from "react";
import { useLogin } from "./hooks/useLogin";

const LoginPage: React.FC = () => {
  const { form, handleChange, handleSubmit } = useLogin();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Id Cliente */}
          <div>
            <label
              htmlFor="c"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Id Cliente
            </label>
            <input
              type="text"
              name="idClient"
              value={form.idClient}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Usuario */}
          <div>
            <label
              htmlFor="usernameInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Usuario:
            </label>
            <input
              type="text"
              name="userClient"
              value={form.userClient}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="passwordInput"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña:
            </label>
            <input
              type="password"
              name="passClient"
              value={form.passClient}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
