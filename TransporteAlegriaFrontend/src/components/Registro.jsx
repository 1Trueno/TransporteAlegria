import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { authService } from "../services/api";
import logo from "../images/LogoTPFM.png";

// Esquema de validación con Yup
const schema = yup
  .object({
    email: yup
      .string()
      .email("Debe ser un email válido")
      .required("El email es obligatorio"),
    password: yup
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres")
      .required("La contraseña es obligatoria"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password"), null], "Las contraseñas deben coincidir")
      .required("Confirma tu contraseña"),
    nombre: yup
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .required("El nombre es obligatorio"),
    apellido: yup
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .required("El apellido es obligatorio"),
    telefono: yup
      .string()
      .matches(/^[0-9+\-\s()]+$/, "Formato de teléfono inválido")
      .min(7, "El teléfono debe tener al menos 7 dígitos")
      .required("El teléfono es obligatorio"),
  })
  .required();

const Registro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authService.registro(data);
      reset();

      setMessage(`
        ${response.message}
        
        📧 Se ha enviado un email de verificación a tu dirección de correo.
        ⚠️ IMPORTANTE: Debes verificar tu email antes de poder iniciar sesión.
        🔍 Revisa tu bandeja de entrada y spam.
      `);
    } catch (err) {
      if (err.error) setError(err.error);
      else if (err.email) setError("Error en el email: " + err.email[0]);
      else if (err.password)
        setError("Error en la contraseña: " + err.password[0]);
      else if (err.nombre) setError("Error en el nombre: " + err.nombre[0]);
      else if (err.apellido)
        setError("Error en el apellido: " + err.apellido[0]);
      else if (err.telefono)
        setError("Error en el teléfono: " + err.telefono[0]);
      else setError("Error en el registro. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const baseInput =
    "appearance-none block w-full pl-10 pr-3 py-2 border placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-300 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        <div>
          <img src={logo} alt="LogoTP" className="mx-auto h-30 w-30" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear Cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Regístrate en Transporte Alegría
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* CONTENEDOR DE INPUTS: separación pareja */}

          <div className="rounded-md space-y-4">
            {/* Nombre y Apellido (mismo row) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <div className="relative w-full">
                <input
                  {...register("nombre")}
                  id="nombre"
                  type="text"
                  autoComplete="given-name"
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.nombre ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md sm:text-sm`}
                  placeholder="Nombre"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Ícono usuario */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A9 9 0 0112 15c2.04 0 3.918.682 5.414 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.nombre.message}
                  </p>
                )}
              </div>

              {/* Apellido */}
              <div className="relative w-full">
                <input
                  {...register("apellido")}
                  id="apellido"
                  type="text"
                  autoComplete="family-name"
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.apellido ? "border-red-300" : "border-gray-300"
                  } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md sm:text-sm`}
                  placeholder="Apellido"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Ícono usuario */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A9 9 0 0112 15c2.04 0 3.918.682 5.414 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.apellido.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="relative w-full">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                className={`${baseInput} ${
                  errors.email ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Ej. juan@email.com"
              />
              {/* Ícono: correo */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div className="relative w-full">
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                {...register("password")}
                id="password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                className={`${baseInput} ${
                  errors.password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Contraseña"
              />
              {/* Ícono: candado */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11V7a4 4 0 10-8 0v4m12 0V7a4 4 0 10-8 0v4m-2 0h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"
                  />
                </svg>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar Contraseña */}
            <div className="relative w-full">
              <label htmlFor="confirm_password" className="sr-only">
                Confirmar contraseña
              </label>
              <input
                {...register("confirm_password")}
                id="confirm_password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirm_password}
                className={`${baseInput} ${
                  errors.confirm_password ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Confirmar contraseña"
              />
              {/* Ícono: candado + check */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11V7a4 4 0 10-8 0v4m-2 0h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 16l2 2 4-4"
                  />
                </svg>
              </div>
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Teléfono */}
            <div className="relative w-full">
              <label htmlFor="telefono" className="sr-only">
                Teléfono
              </label>
              <input
                {...register("telefono")}
                id="telefono"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!errors.telefono}
                className={`${baseInput} ${
                  errors.telefono ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Teléfono"
              />
              {/* Ícono: teléfono */}
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5.25A16.5 16.5 0 0018.75 21l2.2-2.2a1.5 1.5 0 00-.38-2.4l-3.1-1.55a1.5 1.5 0 00-1.7.33l-.7.7a12 12 0 01-5.9-5.9l.7-.7a1.5 1.5 0 00.33-1.7L9.6 3.43a1.5 1.5 0 00-2.4-.38L5 5.25z"
                  />
                </svg>
              </div>
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telefono.message}
                </p>
              )}
            </div>
          </div>

          {/* Mensajes */}
          {message && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 whitespace-pre-line text-sm text-green-800">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Botón */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 text-sm font-medium rounded-lg text-white ${
                isLoading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Registrando...
                </>
              ) : (
                "Crear Cuenta"
              )}
            </button>
          </div>

          <div className="text-center mt-3">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
