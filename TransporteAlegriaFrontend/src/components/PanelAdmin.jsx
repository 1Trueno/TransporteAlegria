import React, { useState, useEffect } from "react";
import { api } from "../services/api";

const PanelAdmin = () => {
  const [formularios, setFormularios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFormulario, setSelectedFormulario] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFormularios();
  }, []);

  const fetchFormularios = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/admin/formularios/");
      setFormularios(response.data);
    } catch (error) {
      console.error("Error obteniendo formularios:", error);
      setError("Error al cargar los formularios");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAprobar = async (id, aprobado) => {
    try {
      await api.patch(`/admin/padres/${id}/aprobar/`, { aprobado });
      setMessage(`Formulario ${aprobado ? 'aprobado' : 'desaprobado'} exitosamente`);
      fetchFormularios(); // Recargar la lista
    } catch (error) {
      console.error("Error aprobando formulario:", error);
      setError("Error al aprobar/desaprobar el formulario");
    }
  };

  const handleEliminarFormulario = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este formulario?")) {
      try {
        await api.delete(`/admin/formularios/${id}/`);
        setMessage("Formulario eliminado exitosamente");
        fetchFormularios(); // Recargar la lista
      } catch (error) {
        console.error("Error eliminando formulario:", error);
        setError("Error al eliminar el formulario");
      }
    }
  };

  const handleEliminarUsuario = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario y su formulario? Esta acción no se puede deshacer.")) {
      try {
        await api.delete(`/admin/usuarios/${id}/eliminar/`);
        setMessage("Usuario y formulario eliminados exitosamente");
        fetchFormularios(); // Recargar la lista
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        setError("Error al eliminar el usuario");
      }
    }
  };

  const openModal = (formulario) => {
    setSelectedFormulario(formulario);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFormulario(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-300 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
          <div className="bg-red-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Panel de Administración
            </h1>
            <p className="text-red-100 mt-2">
              Gestión de formularios enviados por los padres
            </p>
          </div>
        </div>

        {/* Mensajes */}
        {message && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Formularios</p>
                <p className="text-2xl font-semibold text-gray-900">{formularios.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aprobados</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formularios.filter(f => f.aprobado).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formularios.filter(f => !f.aprobado).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Estudiantes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formularios.reduce((total, f) => total + f.estudiantes.length, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Formularios */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Formularios Enviados</h2>
          </div>
          
          {formularios.length === 0 ? (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay formularios</h3>
              <p className="mt-1 text-sm text-gray-500">No se han enviado formularios aún.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Padre/Madre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cédula
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estudiantes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formularios.map((formulario) => (
                    <tr key={formulario.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formulario.usuario?.nombre} {formulario.usuario?.apellido}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formulario.usuario?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formulario.cedula}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formulario.estudiantes.length} estudiante(s)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          formulario.aprobado 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {formulario.aprobado ? 'Aprobado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(formulario.fecha_formulario).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(formulario)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => handleAprobar(formulario.id, !formulario.aprobado)}
                            className={`${
                              formulario.aprobado 
                                ? 'text-yellow-600 hover:text-yellow-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {formulario.aprobado ? 'Desaprobar' : 'Aprobar'}
                          </button>
                          <button
                            onClick={() => handleEliminarFormulario(formulario.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                          <button
                            onClick={() => handleEliminarUsuario(formulario.id)}
                            className="text-red-800 hover:text-red-900"
                          >
                            Eliminar Usuario
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal para ver detalles */}
        {showModal && selectedFormulario && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Detalles del Formulario
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Información del Padre */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Información del Padre/Madre</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Nombre:</span> {selectedFormulario.usuario?.nombre} {selectedFormulario.usuario?.apellido}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedFormulario.usuario?.email}
                      </div>
                      <div>
                        <span className="font-medium">Cédula:</span> {selectedFormulario.cedula}
                      </div>
                      <div>
                        <span className="font-medium">Celular:</span> {selectedFormulario.celular || 'No especificado'}
                      </div>
                    </div>
                  </div>

                  {/* Estudiantes */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Estudiantes</h4>
                    {selectedFormulario.estudiantes.map((estudiante, index) => (
                      <div key={index} className="mb-4 p-3 bg-white rounded border">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium">Nombre:</span> {estudiante.nombre} {estudiante.apellido}</div>
                          <div><span className="font-medium">Grado:</span> {estudiante.grado}</div>
                          <div><span className="font-medium">Fecha Nacimiento:</span> {estudiante.fecha_nacimiento}</div>
                          <div><span className="font-medium">Colegio:</span> {estudiante.Colegio || 'No especificado'}</div>
                          {estudiante.H_entrada && (
                            <div><span className="font-medium">Hora Entrada:</span> {estudiante.H_entrada}</div>
                          )}
                          {estudiante.H_salida && (
                            <div><span className="font-medium">Hora Salida:</span> {estudiante.H_salida}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Tutores */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Tutores Autorizados</h4>
                    {selectedFormulario.tutores_receptores.map((tutor, index) => (
                      <div key={index} className="mb-4 p-3 bg-white rounded border">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div><span className="font-medium">Nombre:</span> {tutor.nombre} {tutor.apellido}</div>
                          <div><span className="font-medium">Parentesco:</span> {tutor.parentesco || 'No especificado'}</div>
                          <div><span className="font-medium">Teléfono:</span> {tutor.telefono || 'No especificado'}</div>
                          <div><span className="font-medium">Dirección:</span> {tutor.direccion || 'No especificado'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelAdmin;
