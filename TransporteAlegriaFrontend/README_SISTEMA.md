# Sistema de Transporte Alegría - Documentación

## Descripción del Sistema

Este sistema permite gestionar formularios de registro de estudiantes para un servicio de transporte escolar. Incluye dos roles principales:

- **Padre/Madre**: Puede llenar formularios con información de sus hijos y tutores autorizados
- **Administrador**: Puede revisar, aprobar, editar y eliminar formularios enviados por los padres

## Funcionalidades Implementadas

### Para Padres/Madres:
1. **Dashboard personalizado** que muestra:
   - Estado de su formulario (enviado/no enviado, aprobado/pendiente)
   - Lista de sus estudiantes registrados
   - Acceso directo al formulario

2. **Formulario de registro** que incluye:
   - Información personal del padre/madre (cédula, celular)
   - Información de estudiantes (nombre, apellido, fecha nacimiento, grado, colegio, horarios)
   - Información de tutores autorizados (nombre, apellido, parentesco, teléfono, dirección)
   - Capacidad de agregar múltiples estudiantes y tutores

### Para Administradores:
1. **Panel de administración** con:
   - Estadísticas generales del sistema
   - Lista de todos los formularios enviados
   - Estado de aprobación de cada formulario
   - Fecha de envío de cada formulario

2. **Acciones administrativas**:
   - Ver detalles completos de cada formulario
   - Aprobar/desaprobar formularios
   - Eliminar formularios específicos
   - Eliminar usuarios y sus formularios

## Estructura del Proyecto

### Backend (Django REST Framework)
- **Modelos**: Usuario, Padres, Estudiantes, Tutor_receptor
- **Endpoints principales**:
  - `/api/auth/` - Autenticación (registro, login, logout)
  - `/api/dashboard/` - Datos del dashboard según rol
  - `/api/formularios/enviar/` - Envío de formularios (solo padres)
  - `/api/admin/formularios/` - Gestión de formularios (solo admins)
  - `/api/admin/padres/{id}/aprobar/` - Aprobar formularios (solo admins)

### Frontend (React)
- **Componentes principales**:
  - `Dashboard.jsx` - Vista principal adaptada según rol
  - `FormularioPadre.jsx` - Formulario para padres
  - `PanelAdmin.jsx` - Panel de administración
  - `Login.jsx`, `Registro.jsx` - Autenticación

## Instalación y Configuración

### Backend (Django)
1. Instalar dependencias:
```bash
pip install django djangorestframework django-cors-headers
```

2. Ejecutar migraciones:
```bash
python manage.py makemigrations
python manage.py migrate
```

3. Crear superusuario:
```bash
python manage.py createsuperuser
```

4. Ejecutar servidor:
```bash
python manage.py runserver
```

### Frontend (React)
1. Instalar dependencias:
```bash
npm install
```

2. Ejecutar servidor de desarrollo:
```bash
npm run dev
```

## Uso del Sistema

### Para Padres:
1. Registrarse en el sistema
2. Verificar email
3. Iniciar sesión
4. Acceder al dashboard y hacer clic en "Llenar Formulario"
5. Completar información de estudiantes y tutores
6. Enviar formulario

### Para Administradores:
1. Iniciar sesión con cuenta de administrador
2. Acceder al dashboard y hacer clic en "Abrir Panel Admin"
3. Revisar formularios pendientes
4. Aprobar o rechazar formularios según corresponda

## Comandos de Mantenimiento

### Eliminación Automática de Formularios Expirados
```bash
# Ver qué se eliminaría (dry run)
python manage.py limpiar_formularios --dry-run

# Eliminar formularios no aprobados después de 30 días
python manage.py limpiar_formularios --dias 30

# Eliminar formularios no aprobados después de 7 días
python manage.py limpiar_formularios --dias 7
```

## Características de Seguridad

- Autenticación basada en tokens
- Verificación de email obligatoria
- Roles diferenciados (padre/admin)
- Validación de permisos en cada endpoint
- Eliminación automática de formularios no aprobados

## Flujo de Trabajo

1. **Padre se registra** → Recibe email de verificación
2. **Padre verifica email** → Puede iniciar sesión
3. **Padre llena formulario** → Formulario queda pendiente de aprobación
4. **Admin revisa formulario** → Puede aprobar o rechazar
5. **Formulario aprobado** → Se guarda permanentemente
6. **Formulario no aprobado** → Se elimina automáticamente después de X días

## Notas Técnicas

- Los formularios no aprobados se eliminan automáticamente para evitar acumulación de datos
- El sistema maneja múltiples estudiantes y tutores por padre
- La interfaz es responsive y funciona en dispositivos móviles
- Se incluye validación tanto en frontend como backend
