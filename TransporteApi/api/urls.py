# Importaciones necesarias para las URLs
from django.urls import path  # Para definir rutas URL
from .views import (  # Importar todas las vistas que vamos a usar
    registro_usuario, login_usuario, logout_usuario, perfil_usuario, dashboard, verificar_email,
    enviar_formulario, eliminar_usuario, aprobar_padre,
    PadresListCreateView, PadresDetailView,
    EstudiantesListCreateView, EstudiantesDetailView,
    TutorReceptorListCreateView, TutorReceptorDetailView,
    FormulariosAdminView, FromularioDetailAdminView
    
)

# Lista de patrones de URL para la aplicación 'api'
urlpatterns = [
    # ============================================================================
    # ENDPOINTS DE AUTENTICACIÓN
    # ============================================================================
    
    # POST: Registrar un nuevo usuario
    # URL: /api/auth/registro/
    # Función: registro_usuario
    # Permisos: Cualquiera puede acceder (sin autenticación)
    path('auth/registro/', registro_usuario, name='registro'),
    
    # POST: Iniciar sesión de un usuario existente
    # URL: /api/auth/login/
    # Función: login_usuario
    # Permisos: Cualquiera puede acceder (sin autenticación)
    path('auth/login/', login_usuario, name='login'),
    
    # POST: Cerrar sesión del usuario actual
    # URL: /api/auth/logout/
    # Función: logout_usuario
    # Permisos: Solo usuarios autenticados
    path('auth/logout/', logout_usuario, name='logout'),
    
    # GET: Obtener perfil del usuario autenticado
    # URL: /api/auth/perfil/
    # Función: perfil_usuario
    # Permisos: Solo usuarios autenticados
    path('auth/perfil/', perfil_usuario, name='perfil'),
    
    # GET: Verificar email del usuario
    # URL: /api/auth/verificar-email/<token>/
    # Función: verificar_email
    # Permisos: Cualquiera puede acceder (sin autenticación)
    path('auth/verificar-email/<str:token>/', verificar_email, name='verificar-email'),
    
    # ============================================================================
    # ENDPOINTS PARA CRUD DE PADRES
    # ============================================================================
    
    # GET: Listar todos los padres
    # POST: Crear un nuevo padre
    # URL: /api/padres/
    # Vista: PadresListCreateView (clase)
    # Permisos: Solo usuarios autenticados
    path('padres/', PadresListCreateView.as_view(), name='padres-list'),
    
    # GET: Obtener un padre específico por ID
    # PUT/PATCH: Actualizar un padre específico
    # DELETE: Eliminar un padre específico
    # URL: /api/padres/<id>/
    # Vista: PadresDetailView (clase)
    # Permisos: Solo usuarios autenticados
    path('padres/<int:pk>/', PadresDetailView.as_view(), name='padres-detail'),
    
    # ============================================================================
    # ENDPOINTS PARA CRUD DE ESTUDIANTES
    # ============================================================================
    
    # GET: Listar todos los estudiantes
    # POST: Crear un nuevo estudiante
    # URL: /api/estudiantes/
    # Vista: EstudiantesListCreateView (clase)
    # Permisos: Solo usuarios autenticados
    path('estudiantes/', EstudiantesListCreateView.as_view(), name='estudiantes-list'),
    
    # GET: Obtener un estudiante específico por ID
    # PUT/PATCH: Actualizar un estudiante específico
    # DELETE: Eliminar un estudiante específico
    # URL: /api/estudiantes/<id>/
    # Vista: EstudiantesDetailView (clase)
    # Permisos: Solo usuarios autenticados
    path('estudiantes/<int:pk>/', EstudiantesDetailView.as_view(), name='estudiantes-detail'),
    
    # ============================================================================
    # ENDPOINTS PARA CRUD DE TUTORES RECEPTORES
    # ============================================================================
    
    # GET: Listar todos los tutores receptores
    # POST: Crear un nuevo tutor receptor
    # URL: /api/tutores/
    # Vista: TutorReceptorListCreateView (clase)
    # Permisos: Solo usuarios autenticados
    path('tutores/', TutorReceptorListCreateView.as_view(), name='tutores-list'),
    
    # GET: Obtener un tutor receptor específico por ID
    # PUT/PATCH: Actualizar un tutor receptor específico
    # DELETE: Eliminar un tutor receptor específico
    # URL: /api/tutores/<id>/
    # Vista: TutorReceptorDetailView (clase)
    # Permisos: Solo usuarios autenticados
    path('tutores/<int:pk>/', TutorReceptorDetailView.as_view(), name='tutores-detail'),


    path('dashboard/', dashboard, name='dashboard'),  # Endpoint para estadísticas del dashboard
    
    # ============================================================================
    # ENDPOINTS PARA FORMULARIOS
    # ============================================================================
    
    # POST: Enviar formulario (solo padres)
    # URL: /api/formularios/enviar/
    # Función: enviar_formulario
    # Permisos: Solo usuarios autenticados con rol padre
    path('formularios/enviar/', enviar_formulario, name='enviar-formulario'),
    
    # ============================================================================
    # ENDPOINTS DE ADMINISTRACIÓN
    # ============================================================================
    
    # GET: Listar todos los formularios (solo admins)
    # URL: /api/admin/formularios/
    # Vista: FormulariosAdminView
    # Permisos: Solo admins
    path('admin/formularios/', FormulariosAdminView.as_view(), name='admin-formularios-list'),
    
    # GET: Obtener formulario específico (solo admins)
    # DELETE: Eliminar formulario específico (solo admins)
    # URL: /api/admin/formularios/<id>/
    # Vista: FromularioDetailAdminView
    # Permisos: Solo admins
    path('admin/formularios/<int:pk>/', FromularioDetailAdminView.as_view(), name='admin-formularios-detail'),
    
    # PATCH: Aprobar/desaprobar padre (solo admins)
    # URL: /api/admin/padres/<id>/aprobar/
    # Función: aprobar_padre
    # Permisos: Solo admins
    path('admin/padres/<int:pk>/aprobar/', aprobar_padre, name='aprobar-padre'),
    
    # DELETE: Eliminar usuario y formulario (solo admins)
    # URL: /api/admin/usuarios/<id>/eliminar/
    # Función: eliminar_usuario
    # Permisos: Solo admins
    path('admin/usuarios/<int:pk>/eliminar/', eliminar_usuario, name='eliminar-usuario'),
]
