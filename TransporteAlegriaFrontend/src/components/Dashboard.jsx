import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService, getCurrentUser, isAuthenticated, api } from "../services/api";
import FormularioPadre from "./FormularioPadre";
import PanelAdmin from "./PanelAdmin";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");

  useEffect(() => {
    const fetchUserAndDashboard = async () => {
      // 1. Verificar si el usuario está autenticado
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      // 2. Obtener los datos del usuario actual
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        // 3. Obtener datos del dashboard
        const response = await api.get("/dashboard/");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si el usuario es admin y quiere ver el panel de administración
  if (user?.role === 'admin' && currentView === 'admin') {
    return <PanelAdmin />;
  }

  // Si el usuario es padre y quiere ver el formulario
  if (user?.role === 'padre' && currentView === 'formulario') {
    return <FormularioPadre />;
  }

  // 🔹 Normalizar el valor de verificación de email a booleano
  const emailVerificado =
    String(user?.email_verificado).toLowerCase() === "true" ||
    user?.email_verificado === 1 ||
    user?.email_verificado === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-300">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Transporte Alegría
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Bienvenido, {user?.nombre} {user?.apellido}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                ¡Bienvenido a tu Dashboard!
              </h2>

              {/* Mensaje específico según el rol */}
              {dashboardData?.mensaje && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800">{dashboardData.mensaje}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-blue-900">
                        Información Personal
                      </h3>
                      <p className="text-blue-700">
                        {user?.nombre} {user?.apellido}
                      </p>
                      <p className="text-blue-600 text-sm">{user?.email}</p>
                      {user?.telefono && (
                        <p className="text-blue-600 text-sm">
                          {user?.telefono}
                        </p>
                      )}
                      <p className="text-blue-600 text-sm">
                        Rol: {user?.role === 'admin' ? 'Administrador' : 'Padre'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email Verification Status */}
                <div
                  className={`border rounded-lg p-6 ${
                    emailVerificado
                      ? "bg-green-50 border-green-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          emailVerificado ? "bg-green-600" : "bg-yellow-600"
                        }`}
                      >
                        {emailVerificado ? (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Estado del Email
                      </h3>
                      <p
                        className={`text-sm ${
                          emailVerificado ? "text-green-700" : "text-yellow-700"
                        }`}
                      >
                        {emailVerificado
                          ? "Email verificado ✓"
                          : "Email pendiente de verificación ⚠️"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-indigo-900">
                        Estado del Formulario
                      </h3>
                      {user?.role === 'padre' ? (
                        <>
                          {dashboardData?.formulario_enviado ? (
                            <p className={`text-sm ${
                              dashboardData?.formulario_aprobado 
                                ? 'text-green-700' 
                                : 'text-yellow-700'
                            }`}>
                              {dashboardData?.formulario_aprobado 
                                ? 'Formulario Aprobado ✓' 
                                : 'Formulario Pendiente de Aprobación ⏳'}
                            </p>
                          ) : (
                            <p className="text-sm text-red-700">
                              Formulario No Enviado ❌
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-indigo-700">
                          Panel de Administración
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions based on role */}
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Acciones Disponibles
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user?.role === 'admin' ? (
                    <>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Panel de Administración
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Gestiona todos los formularios enviados por los padres.
                        </p>
                        <button 
                          onClick={() => setCurrentView('admin')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Abrir Panel Admin
                        </button>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Estadísticas del Sistema
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Total de padres: {dashboardData?.total_padres || 0}
                        </p>
                        <p className="text-gray-600 text-sm mb-3">
                          Total de estudiantes: {dashboardData?.total_estudiantes || 0}
                        </p>
                        <p className="text-gray-600 text-sm mb-3">
                          Formularios aprobados: {dashboardData?.padres_aprobados || 0}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Formulario de Registro
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          Complete el formulario con la información de sus hijos y tutores autorizados.
                        </p>
                        <button 
                          onClick={() => setCurrentView('formulario')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          {dashboardData?.formulario_enviado ? 'Actualizar Formulario' : 'Llenar Formulario'}
                        </button>
                      </div>

                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Mis Estudiantes
                        </h4>
                        <p className="text-gray-600 text-sm mb-3">
                          {dashboardData?.estudiantes?.length || 0} estudiante(s) registrado(s)
                        </p>
                        {dashboardData?.estudiantes?.map((estudiante, index) => (
                          <p key={index} className="text-gray-600 text-sm">
                            • {estudiante.nombre} {estudiante.apellido} - {estudiante.grado}
                          </p>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
