# Transporte Alegría Frontend

Frontend de la aplicación Transporte Alegría desarrollado con React, Vite y Tailwind CSS.

## 🚀 Configuración Inicial

### Prerrequisitos
- Node.js (versión 16 o superior)
- Python 3.8+ con pip
- Backend Django configurado en la carpeta `../TransporteApi`

### Instalación

1. **Instalar dependencias del frontend:**
   ```bash
   npm install
   ```

2. **Configurar el backend Django:**
   
   En la carpeta `../TransporteApi`:
   ```bash
   # Activar entorno virtual
   .venv\Scripts\activate
   
   # Instalar dependencias (si no están instaladas)
   pip install django-cors-headers djangorestframework
   
   # Crear y aplicar migraciones
   python manage.py makemigrations
   python manage.py migrate
   
   # Crear superusuario (opcional)
   python manage.py createsuperuser
   ```

3. **Configurar variables de entorno:**
   
   Crea un archivo `.env.local` en la raíz del proyecto con:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Ejecutar los servicios:**
   
   **Opción 1: Ejecutar ambos servicios juntos:**
   ```bash
   npm run dev:full
   ```
   
   **Opción 2: Ejecutar por separado:**
   
   Terminal 1 (Backend):
   ```bash
   npm run backend
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

## 🔗 Conexión con el Backend

### Configuración de la API

El frontend está configurado para conectarse automáticamente con el backend a través de:

- **URL base:** Configurada en `src/services/api.js`
- **Servicios:** Definidos en `src/services/transporteService.js`
- **Variables de entorno:** Configuradas en `.env.local`

### Endpoints Disponibles

El frontend está configurado para conectarse con los siguientes endpoints del backend Django:

- `GET /api/transportes/` - Obtener todos los transportes
- `GET /api/transportes/{id}/` - Obtener un transporte específico
- `POST /api/transportes/` - Crear un nuevo transporte
- `PUT /api/transportes/{id}/` - Actualizar un transporte
- `DELETE /api/transportes/{id}/` - Eliminar un transporte
- `GET /api/transportes/estadisticas/` - Obtener estadísticas

**Nota:** Los endpoints exactos dependerán de cómo configures tus modelos y vistas en Django.

### Prueba de Conexión

1. Asegúrate de que el backend esté ejecutándose
2. Abre el frontend en tu navegador
3. Haz clic en "🔗 Probar Conexión" para verificar la conectividad
4. Si hay errores, revisa la consola del navegador para más detalles

## 🛠️ Estructura del Proyecto

```
src/
├── services/
│   ├── api.js              # Configuración de axios
│   └── transporteService.js # Servicios para el backend
├── App.jsx                 # Componente principal
└── main.jsx               # Punto de entrada
```

## 🎨 Características

- **Interfaz moderna** con Tailwind CSS
- **Conexión automática** con el backend
- **Manejo de errores** robusto
- **Estados de carga** para mejor UX
- **Responsive design** para todos los dispositivos

## 🔧 Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la build
- `npm run lint` - Ejecutar linter

## 🚨 Solución de Problemas

### Error de Conexión
Si ves errores de conexión:

1. Verifica que el backend esté ejecutándose
2. Confirma la URL en `.env.local`
3. Revisa que no haya problemas de CORS en el backend
4. Verifica la consola del navegador para errores específicos

### CORS Issues
Si tienes problemas de CORS, asegúrate de que tu backend Django tenga configurado:

1. **django-cors-headers** instalado y configurado en `settings.py`
2. **CORS_ALLOWED_ORIGINS** incluyendo `http://localhost:5173` y `http://127.0.0.1:5173`
3. **CorsMiddleware** agregado al inicio de `MIDDLEWARE`

### Backend Django
Si el backend no responde:
1. Verifica que esté ejecutándose en el puerto 8000
2. Confirma que las migraciones estén aplicadas
3. Revisa los logs del servidor Django para errores

## 📝 Notas

- El frontend usa Vite como bundler para desarrollo rápido
- Tailwind CSS está configurado para estilos modernos
- Axios se usa para las peticiones HTTP al backend Django
- Las variables de entorno deben empezar con `VITE_` para ser accesibles en el frontend
- El backend Django usa SQLite por defecto (puedes cambiar a PostgreSQL/MySQL en producción)
- CORS está configurado para permitir comunicación entre frontend y backend
