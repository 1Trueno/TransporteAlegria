import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, authService } from "../services/api";
import formulariosService from "../services/formulariosService";

const DashboardPadre = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Estado del formulario
  const [formulario, setFormulario] = useState({
    cedula: "",
    estudiantes: [{ nombre: "", apellido: "", grado: "" }],
    tutores: [{ nombre: "", apellido: "", telefono: "" }],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          navigate("/login");
          return;
        }
        setUser(currentUser);

        const data = await formulariosService.getDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Error cargando dashboard padre:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  // Manejo de formulario
  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleAddEstudiante = () => {
    setFormulario({
      ...formulario,
      estudiantes: [
        ...formulario.estudiantes,
        { nombre: "", apellido: "", grado: "" },
      ],
    });
  };

  const handleEstudianteChange = (i, e) => {
    const newEstudiantes = [...formulario.estudiantes];
    newEstudiantes[i][e.target.name] = e.target.value;
    setFormulario({ ...formulario, estudiantes: newEstudiantes });
  };

  const handleAddTutor = () => {
    setFormulario({
      ...formulario,
      tutores: [
        ...formulario.tutores,
        { nombre: "", apellido: "", telefono: "" },
      ],
    });
  };

  const handleTutorChange = (i, e) => {
    const newTutores = [...formulario.tutores];
    newTutores[i][e.target.name] = e.target.value;
    setFormulario({ ...formulario, tutores: newTutores });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await formulariosService.enviarFormulario(formulario);
      setShowModal(false);
      const data = await formulariosService.getDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error("Error enviando formulario:", err);
    }
  };

  if (isLoading) {
    return <div className="p-6">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-300">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between">
        <h1 className="text-xl font-bold">Transporte Alegría</h1>
        <div>
          <span className="mr-4">
            {user?.nombre} {user?.apellido} ({user?.email})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Bienvenido, {user?.nombre}
        </h2>

        {/* Estado del formulario */}
        {dashboardData?.estudiantes ? (
          <>
            <p className="mb-4">
              {dashboardData.estudiantes.length} estudiante(s) registrado(s)
            </p>
            {dashboardData.estudiantes.map((est, i) => (
              <p key={i}>
                • {est.nombre} {est.apellido} - {est.grado}
              </p>
            ))}
          </>
        ) : (
          <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
            <p>No has enviado tu formulario todavía.</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Llenar Formulario
            </button>
          </div>
        )}
      </main>

      {/* Modal Formulario */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <h2 className="text-lg font-bold mb-4">Formulario de Registro</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Cedula */}
              <input
                type="text"
                name="cedula"
                placeholder="Cédula"
                value={formulario.cedula}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />

              {/* Datos del usuario (autocompletados) */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={user?.nombre}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
                <input
                  type="text"
                  value={user?.apellido}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100"
                />
                <input
                  type="text"
                  value={user?.email}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100 col-span-2"
                />
                <input
                  type="text"
                  value={user?.telefono}
                  disabled
                  className="w-full border p-2 rounded bg-gray-100 col-span-2"
                />
              </div>

              {/* Estudiantes */}
              <div>
                <h3 className="font-semibold">Estudiantes</h3>
                {formulario.estudiantes.map((est, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre"
                      value={est.nombre}
                      onChange={(e) => handleEstudianteChange(i, e)}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Apellido"
                      value={est.apellido}
                      onChange={(e) => handleEstudianteChange(i, e)}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="grado"
                      placeholder="Grado"
                      value={est.grado}
                      onChange={(e) => handleEstudianteChange(i, e)}
                      className="border p-2 rounded"
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEstudiante}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                >
                  + Añadir Estudiante
                </button>
              </div>

              {/* Tutores */}
              <div>
                <h3 className="font-semibold">Tutores Autorizados</h3>
                {formulario.tutores.map((tutor, i) => (
                  <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="text"
                      name="nombre"
                      placeholder="Nombre"
                      value={tutor.nombre}
                      onChange={(e) => handleTutorChange(i, e)}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="apellido"
                      placeholder="Apellido"
                      value={tutor.apellido}
                      onChange={(e) => handleTutorChange(i, e)}
                      className="border p-2 rounded"
                      required
                    />
                    <input
                      type="text"
                      name="telefono"
                      placeholder="Teléfono"
                      value={tutor.telefono}
                      onChange={(e) => handleTutorChange(i, e)}
                      className="border p-2 rounded"
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddTutor}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                >
                  + Añadir Tutor
                </button>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                >
                  Guardar Formulario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPadre;
