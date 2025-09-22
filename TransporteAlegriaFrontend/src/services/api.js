// Servicio para manejar todas las comunicaciones con la API de Django
import axios from 'axios';

// Configuración base de axios
const API_BASE_URL = 'http://localhost:8000/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Registrar nuevo usuario
  async registro(userData) {
    try {
      const response = await api.post('/auth/registro/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error en el registro' };
    }
  },

  // Iniciar sesión
  async login(credentials) {
    try {
      const response = await api.post('/auth/login/', credentials);
      // Guardar token y datos del usuario
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error en el login' };
    }
  },

  // Cerrar sesión
  async logout() {
    try {
      await api.post('/auth/logout/');
      // Limpiar datos locales
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { message: 'Logout exitoso' };
    } catch (error) {
      // Aunque falle el logout, limpiar datos locales
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      throw error.response?.data || { error: 'Error en el logout' };
    }
  },

  // Obtener perfil del usuario
  async getPerfil() {
    try {
      const response = await api.get('/auth/perfil/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo perfil' };
    }
  },

  // Verificar email
  async verificarEmail(token) {
    try {
      const response = await api.get(`/auth/verificar-email/${token}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error verificando email' };
    }
  },
};

// Servicios para Padres
export const padresService = {
  // Obtener todos los padres
  async getAll() {
    try {
      const response = await api.get('/padres/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo padres' };
    }
  },

  // Crear nuevo padre
  async create(padreData) {
    try {
      const response = await api.post('/padres/', padreData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error creando padre' };
    }
  },

  // Obtener padre por ID
  async getById(id) {
    try {
      const response = await api.get(`/padres/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo padre' };
    }
  },

  // Actualizar padre
  async update(id, padreData) {
    try {
      const response = await api.put(`/padres/${id}/`, padreData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error actualizando padre' };
    }
  },

  // Eliminar padre
  async delete(id) {
    try {
      await api.delete(`/padres/${id}/`);
      return { message: 'Padre eliminado exitosamente' };
    } catch (error) {
      throw error.response?.data || { error: 'Error eliminando padre' };
    }
  },
};

// Servicios para Estudiantes
export const estudiantesService = {
  // Obtener todos los estudiantes
  async getAll() {
    try {
      const response = await api.get('/estudiantes/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo estudiantes' };
    }
  },

  // Crear nuevo estudiante
  async create(estudianteData) {
    try {
      const response = await api.post('/estudiantes/', estudianteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error creando estudiante' };
    }
  },

  // Obtener estudiante por ID
  async getById(id) {
    try {
      const response = await api.get(`/estudiantes/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo estudiante' };
    }
  },

  // Actualizar estudiante
  async update(id, estudianteData) {
    try {
      const response = await api.put(`/estudiantes/${id}/`, estudianteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error actualizando estudiante' };
    }
  },

  // Eliminar estudiante
  async delete(id) {
    try {
      await api.delete(`/estudiantes/${id}/`);
      return { message: 'Estudiante eliminado exitosamente' };
    } catch (error) {
      throw error.response?.data || { error: 'Error eliminando estudiante' };
    }
  },
};

// Servicios para Tutores Receptores
export const tutoresService = {
  // Obtener todos los tutores
  async getAll() {
    try {
      const response = await api.get('/tutores/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo tutores' };
    }
  },

  // Crear nuevo tutor
  async create(tutorData) {
    try {
      const response = await api.post('/tutores/', tutorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error creando tutor' };
    }
  },

  // Obtener tutor por ID
  async getById(id) {
    try {
      const response = await api.get(`/tutores/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo tutor' };
    }
  },

  // Actualizar tutor
  async update(id, tutorData) {
    try {
      const response = await api.put(`/tutores/${id}/`, tutorData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error actualizando tutor' };
    }
  },

  // Eliminar tutor
  async delete(id) {
    try {
      await api.delete(`/tutores/${id}/`);
      return { message: 'Tutor eliminado exitosamente' };
    } catch (error) {
      throw error.response?.data || { error: 'Error eliminando tutor' };
    }
  },
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

// Función para obtener datos del usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Servicios para Formularios
export const formulariosService = {
  // Enviar formulario (solo padres)
  async enviarFormulario(formularioData) {
    try {
      const response = await api.post('/formularios/enviar/', formularioData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error enviando formulario' };
    }
  },

  // Obtener dashboard data
  async getDashboard() {
    try {
      const response = await api.get('/dashboard/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo dashboard' };
    }
  },
};

// Servicios para Administración
export const adminService = {
  // Obtener todos los formularios (solo admins)
  async getFormularios() {
    try {
      const response = await api.get('/admin/formularios/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo formularios' };
    }
  },

  // Obtener formulario específico (solo admins)
  async getFormulario(id) {
    try {
      const response = await api.get(`/admin/formularios/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error obteniendo formulario' };
    }
  },

  // Aprobar/desaprobar formulario (solo admins)
  async aprobarFormulario(id, aprobado) {
    try {
      const response = await api.patch(`/admin/padres/${id}/aprobar/`, { aprobado });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Error aprobando formulario' };
    }
  },

  // Eliminar formulario (solo admins)
  async eliminarFormulario(id) {
    try {
      await api.delete(`/admin/formularios/${id}/`);
      return { message: 'Formulario eliminado exitosamente' };
    } catch (error) {
      throw error.response?.data || { error: 'Error eliminando formulario' };
    }
  },

  // Eliminar usuario y formulario (solo admins)
  async eliminarUsuario(id) {
    try {
      await api.delete(`/admin/usuarios/${id}/eliminar/`);
      return { message: 'Usuario y formulario eliminados exitosamente' };
    } catch (error) {
      throw error.response?.data || { error: 'Error eliminando usuario' };
    }
  },
};

export { api };
export default api;
