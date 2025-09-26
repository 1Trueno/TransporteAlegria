import api from "./api";

const formulariosService = {
  async getDashboard() {
    const response = await api.get("/dashboard/");
    return response.data;
  },

  async enviarFormulario(data) {
    const response = await api.post("/formularios/enviar/", data);
    return response.data;
  },

  //ADMIN: Obtener formularios
  async getFormularios() {
    const response = await api.get("/admin/formularios/");
    return response.data;
  },

  //ADMIN: aprobar o desaprobar formulario
  async aprobarFormulario () {
    const response = await api.post(`/admin/padres/${id}/aprobar/`,{aprobado});
    return response.data;
  },

  //ADMIN: eliminar formulario
  async eliminarFormulario(id) {
    const response = await api.delete(`/admin/formularios/${id}/`);
    return response.data;
  },

  //ADMIN: eliminar usuario (junto con formulario)
  async eliminarUsuario () {
    const response = await api.delete(`/admin/usuarios/${id}/eliminar/`)
    return response.data;
  },

};

export default formulariosService;