import React, { useState } from "react";
import { api } from '../services/api';

const FormularioPadre = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    celular: "",
    estudiantes: [
      {
        nombre: "",
        apellido: "",
        fecha_nacimiento: "",
        grado: "",
        edad: "",
        Colegio: "",
        H_entrada: "",
        H_salida: "",
      },
    ],
    tutores_receptores: [
      {
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        parentesco: "",
        estudiante_id: 0,
      },
    ],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e, index, field, subField = null) => {
    const value = e.target.value;
    
    if (subField) {
      // Para campos anidados (estudiantes, tutores)
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => 
          i === index ? { ...item, [subField]: value } : item
        )
      }));
    } else {
      // Para campos principales
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addEstudiante = () => {
    setFormData(prev => ({
      ...prev,
      estudiantes: [
        ...prev.estudiantes,
        {
          nombre: "",
          apellido: "",
          fecha_nacimiento: "",
          grado: "",
          edad: "",
          Colegio: "",
          H_entrada: "",
          H_salida: "",
        },
      ],
    }));
  };

  const removeEstudiante = (index) => {
    if (formData.estudiantes.length > 1) {
      setFormData(prev => ({
        ...prev,
        estudiantes: prev.estudiantes.filter((_, i) => i !== index),
      }));
    }
  };

  const addTutor = () => {
    setFormData(prev => ({
      ...prev,
      tutores_receptores: [
        ...prev.tutores_receptores,
        {
          nombre: "",
          apellido: "",
          direccion: "",
          telefono: "",
          parentesco: "",
          estudiante_id: 0,
        },
      ],
    }));
  };

  const removeTutor = (index) => {
    if (formData.tutores_receptores.length > 1) {
      setFormData(prev => ({
        ...prev,
        tutores_receptores: prev.tutores_receptores.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      // Preparar datos para envío
      const dataToSend = {
        cedula: formData.cedula,
        celular: formData.celular,
        estudiantes: formData.estudiantes.map((est, index) => ({
          ...est,
          id: index + 1, // ID temporal para asociar tutores
        })),
        tutores_receptores: formData.tutores_receptores.map(tutor => ({
          ...tutor,
          estudiante_id: tutor.estudiante_id || 1, // Asociar al primer estudiante por defecto
        })),
      };

      const response = await api.post("/formularios/enviar/", dataToSend);
      
      setMessage("Formulario enviado exitosamente. Será revisado por el administrador.");
      
      // Limpiar formulario
      setFormData({
        cedula: "",
        celular: "",
        estudiantes: [
          {
            nombre: "",
            apellido: "",
            fecha_nacimiento: "",
            grado: "",
            edad: "",
            Colegio: "",
            H_entrada: "",
            H_salida: "",
          },
        ],
        tutores_receptores: [
          {
            nombre: "",
            apellido: "",
            direccion: "",
            telefono: "",
            parentesco: "",
            estudiante_id: 0,
          },
        ],
      });
    } catch (error) {
      console.error("Error enviando formulario:", error);
      setError(
        error.response?.data?.error || 
        "Error al enviar el formulario. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-300 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Formulario de Registro de Estudiantes
            </h1>
            <p className="text-blue-100 mt-2">
              Complete la información de sus hijos y los tutores autorizados para recibirlos
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Información del Padre */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Información del Padre/Madre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula *
                  </label>
                  <input
                    type="text"
                    value={formData.cedula}
                    onChange={(e) => handleInputChange(e, null, "cedula")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength="13"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Celular
                  </label>
                  <input
                    type="tel"
                    value={formData.celular}
                    onChange={(e) => handleInputChange(e, null, "celular")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength="13"
                  />
                </div>
              </div>
            </div>

            {/* Estudiantes */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Información de Estudiantes
                </h2>
                <button
                  type="button"
                  onClick={addEstudiante}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  + Agregar Estudiante
                </button>
              </div>

              {formData.estudiantes.map((estudiante, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Estudiante {index + 1}
                    </h3>
                    {formData.estudiantes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEstudiante(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={estudiante.nombre}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "nombre")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={estudiante.apellido}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "apellido")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={estudiante.fecha_nacimiento}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "fecha_nacimiento")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Grado *
                      </label>
                      <input
                        type="text"
                        value={estudiante.grado}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "grado")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Edad
                      </label>
                      <input
                        type="number"
                        value={estudiante.edad}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "edad")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="18"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colegio
                      </label>
                      <input
                        type="text"
                        value={estudiante.Colegio}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "Colegio")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Entrada
                      </label>
                      <input
                        type="time"
                        value={estudiante.H_entrada}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "H_entrada")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hora de Salida
                      </label>
                      <input
                        type="time"
                        value={estudiante.H_salida}
                        onChange={(e) => handleInputChange(e, index, "estudiantes", "H_salida")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tutores Receptores */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Tutores Autorizados para Recibir
                </h2>
                <button
                  type="button"
                  onClick={addTutor}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  + Agregar Tutor
                </button>
              </div>

              {formData.tutores_receptores.map((tutor, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800">
                      Tutor {index + 1}
                    </h3>
                    {formData.tutores_receptores.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTutor(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={tutor.nombre}
                        onChange={(e) => handleInputChange(e, index, "tutores_receptores", "nombre")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={tutor.apellido}
                        onChange={(e) => handleInputChange(e, index, "tutores_receptores", "apellido")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parentesco
                      </label>
                      <input
                        type="text"
                        value={tutor.parentesco}
                        onChange={(e) => handleInputChange(e, index, "tutores_receptores", "parentesco")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Abuelo, Tío, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={tutor.telefono}
                        onChange={(e) => handleInputChange(e, index, "tutores_receptores", "telefono")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength="13"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección
                      </label>
                      <input
                        type="text"
                        value={tutor.direccion}
                        onChange={(e) => handleInputChange(e, index, "tutores_receptores", "direccion")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mensajes */}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
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
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
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

            {/* Botón de envío */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-md text-white font-medium ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Enviando..." : "Enviar Formulario"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormularioPadre;
