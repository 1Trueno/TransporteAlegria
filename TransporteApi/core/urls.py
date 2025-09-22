"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

# Importaciones necesarias para las URLs principales
from django.contrib import admin  # Panel de administración de Django
from django.urls import path, include  # Para definir rutas y incluir otras URLs
from api.views import home  # Vista personalizada para la página de inicio

# Lista de patrones de URL principales del proyecto
urlpatterns = [
    # ============================================================================
    # PÁGINA DE INICIO
    # ============================================================================
    
    # GET: Página principal del proyecto
    # URL: http://localhost:8000/
    # Función: home (vista personalizada)
    # Descripción: Muestra información de la API y endpoints disponibles
    path('', home, name='home'),
    
    # ============================================================================
    # PANEL DE ADMINISTRACIÓN
    # ============================================================================
    
    # GET: Panel de administración de Django
    # URL: http://localhost:8000/admin/
    # Función: admin.site.urls (vista de Django)
    # Descripción: Permite gestionar usuarios, datos y configuración
    path('admin/', admin.site.urls),
    
    # ============================================================================
    # API REST
    # ============================================================================
    
    # Incluye todas las URLs de la aplicación 'api'
    # URL base: http://localhost:8000/api/
    # Archivo: api/urls.py
    # Descripción: Todos los endpoints de autenticación y CRUD de datos
    path('api/', include('api.urls')),
]
