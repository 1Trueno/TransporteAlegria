# Importaciones necesarias para Django y Django REST Framework
from django.shortcuts import render
# Para crear vistas y manejar estados HTTP
from rest_framework import status, generics
# Decoradores para vistas
from rest_framework.decorators import api_view, permission_classes
# Permisos de acceso
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response  # Para respuestas HTTP
# Para manejar tokens de autenticación
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout  # Para manejar sesiones
from django.views.decorators.csrf import csrf_exempt  # Para eximir CSRF
from django.utils.decorators import method_decorator  # Para decorar métodos
from django.http import JsonResponse  # Para respuestas JSON


# Importar nuestros modelos y serializers
from .models import Usuario, Padres, Estudiantes, Tutor_receptor
from .serializers import (
    UsuarioSerializer, RegistroSerializer, LoginSerializer,
    PadresSerializer, EstudiantesSerializer, TutorReceptorSerializer, FormularioSerializer,
    EstudiantesSerializer
)

# Importar utilidades de email
from .email_utils import enviar_email_verificacion, enviar_email_bienvenida


def home(request):
    """
    Vista simple para la página de inicio.
    Retorna información sobre la API y sus endpoints disponibles.

    Args:
        request: Objeto de petición HTTP

    Returns:
        JsonResponse: Información de la API en formato JSON
    """
    return JsonResponse({
        'message': 'API de Transporte Alegría funcionando correctamente',
        'endpoints': {
            'autenticacion': '/api/auth/',
            'padres': '/api/padres/',
            'estudiantes': '/api/estudiantes/',
            'tutores': '/api/tutores/',
            'admin': '/admin/'
        }
    })


@api_view(['POST'])  # Solo acepta peticiones POST
@permission_classes([AllowAny])  # Cualquiera puede acceder (sin autenticación)
def registro_usuario(request):
    """
    Endpoint para registrar un nuevo usuario.

    Args:
        request: Objeto de petición HTTP con datos del formulario

    Returns:
        Response: Usuario creado (sin token hasta verificar email)
    """
    # Validar y procesar los datos del formulario
    serializer = RegistroSerializer(data=request.data)

    if serializer.is_valid():
        # Crear el usuario (pero no está verificado aún)
        user = serializer.save()

        # Enviar email de verificación
        email_enviado = enviar_email_verificacion(user)

        if email_enviado:
            # Retornar respuesta exitosa
            return Response({
                'message': 'Usuario registrado exitosamente. Revisa tu email para verificar tu cuenta.',
                'user': UsuarioSerializer(user).data,
                'email_verificado': False,
                'instrucciones': 'Se ha enviado un email de verificación a tu dirección de correo.'
            }, status=status.HTTP_201_CREATED)
        else:
            # Si hay error enviando el email, eliminar el usuario
            user.delete()
            return Response({
                'error': 'Error enviando email de verificación. Intenta nuevamente.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Si hay errores de validación, retornar los errores
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])  # Solo acepta peticiones GET
@permission_classes([AllowAny])  # Cualquiera puede acceder (sin autenticación)
def verificar_email(request, token):
    """
    Endpoint para verificar el email del usuario usando el token.

    Args:
        request: Objeto de petición HTTP
        token: Token de verificación enviado por email

    Returns:
        Response: Confirmación de verificación exitosa
    """
    try:
        # Buscar usuario con el token de verificación
        usuario = Usuario.objects.get(token_verificacion=token)

        # Marcar email como verificado
        usuario.email_verificado = True
        usuario.token_verificacion = None  # Limpiar el token usado
        usuario.save()

        # Enviar email de bienvenida
        enviar_email_bienvenida(usuario)

        return Response({
            'message': 'Email verificado exitosamente. Ya puedes iniciar sesión.',
            'email_verificado': True,
            'usuario': UsuarioSerializer(usuario).data
        }, status=status.HTTP_200_OK)

    except Usuario.DoesNotExist:
        return Response({
            'error': 'Token de verificación inválido o expirado.'
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({
            'error': f'Error verificando email: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])  # Solo acepta peticiones POST
@permission_classes([AllowAny])  # Cualquiera puede acceder (sin autenticación)
def login_usuario(request):
    """
    Endpoint para autenticar un usuario existente.

    Args:
        request: Objeto de petición HTTP con credenciales

    Returns:
        Response: Usuario autenticado y token de autenticación
    """
    # Validar las credenciales
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        # Obtener el usuario autenticado
        user = serializer.validated_data['user']

        # Verificar que el email esté confirmado
        if not user.email_verificado:
            return Response({
                'error': 'Debes verificar tu email antes de poder iniciar sesión. Revisa tu correo electrónico.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Iniciar sesión (para compatibilidad con Django)
        login(request, user)

        # Crear o obtener el token de autenticación
        token, created = Token.objects.get_or_create(user=user)

        # Retornar respuesta exitosa
        return Response({
            'message': 'Login exitoso',
            'user': UsuarioSerializer(user).data,  # Datos del usuario
            'token': token.key  # Token para autenticación
        }, status=status.HTTP_200_OK)

    # Si las credenciales son inválidas, retornar error
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])  # Solo acepta peticiones POST
# Solo usuarios autenticados pueden acceder
@permission_classes([IsAuthenticated])
def logout_usuario(request):
    """
    Endpoint para cerrar sesión del usuario.

    Args:
        request: Objeto de petición HTTP (usuario debe estar autenticado)

    Returns:
        Response: Mensaje de confirmación
    """
    try:
        # Eliminar el token de autenticación
        request.user.auth_token.delete()

        # Cerrar sesión
        logout(request)

        return Response({'message': 'Logout exitoso'}, status=status.HTTP_200_OK)
    except:
        # Si hay algún error, retornar mensaje de error
        return Response({'message': 'Error al cerrar sesión'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])  # Solo acepta peticiones GET
# Solo usuarios autenticados pueden acceder
@permission_classes([IsAuthenticated])
def perfil_usuario(request):
    """
    Endpoint para obtener el perfil del usuario autenticado.

    Args:
        request: Objeto de petición HTTP (usuario debe estar autenticado)

    Returns:
        Response: Datos del perfil del usuario
    """
    # Serializar los datos del usuario autenticado
    serializer = UsuarioSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])  # Acepta peticiones GET
# Solo Usuarios autenticados pueden acceder
@permission_classes([IsAuthenticated])
def dashboard(request):  # DASHBOARD
    """
    Endpoint para obtener estadísticas del dashboard.
    Admin: estatisticas generales.
    Padre: estado del formulario + estudiantes asociados.

    Args:
        request: Objeto de petición HTTP (usuario debe estar autenticado)
    """
    user = request.user  # Usuario autenticado

    if user.role == 'admin':  # ADMIN
        data = {
            "mensaje": "Bienvenido al dashboard de administrador",
            "total_padres": Padres.objects.count(),
            "total_estudiantes": Estudiantes.objects.count(),
            "total_tutores": Tutor_receptor.objects.count(),
            "padres_aprobados": Padres.objects.filter(aprobado=True).count(),
        }
    elif user.role == 'padre':  # PADRE
        try:
            padre = Padres.objects.get(usuario=user)
            data = {
                "mensaje": f"Bienvenido al dashboard, {user.nombre}",
                "formulario_enviado": True,
                "formulario_aprobado": padre.aprobado,
                "cedula": padre.cedula,
                "celular": padre.celular,
                "estudiantes": EstudiantesSerializer(padre.estudiantes.all(), many=True).data
            }
        except Padres.DoesNotExist:  # Padre no ha llenado el formulario
            data = {
                "mensaje": f"Bienvenido al dashboard, {user.nombre}",
                "formulario_enviado": False,
                "formulario_aprobado": None,
                "cedula": None,
                "celular": user.telefono,
                "estudiantes": []
            }
    else:
        data = {"error": "Rol de usuario no reconocido."}
    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])  # Solo acepta peticiones POST
# Solo usuarios autenticados pueden acceder
@permission_classes([IsAuthenticated])
def enviar_formulario(request):
    """
    Endpoint para que un padre envíe el formulario con sus datos, estudiantes y tutores
    Args:
        request: Objeto de petición HTTP (usuario debe estar autenticado como padre)
    """
    user = request.user

    # solo los padres pueden enviar formularios
    if user.role != 'padre':
        # Forbidden
        return JsonResponse({'error': 'No autorizado, solo los padres pueden enviar formularios'}, status=403)

    padre_obj, created = Padres.objects.get_or_create(usuario=user, defaults={  # Si no existe, crear nuevo
        "cedula": request.data.get('cedula', ''),
        "celular": request.data.get('celular', user.telefono or ''),
    })  # Obtener o crear el objeto Padre asociado al usuario

    # El serializer recibe la instancia del padre y los datos a actualizar
    data = request.data.copy()  # Copiar los datos para modificarlos

    # Me aseguro que la relacion al padre sea gestionada por el serializer
    # El Formularioserilazer no debe recibir el campo 'usuario' directamente

    serializer = FormularioSerializer(data=data)
    if serializer.is_valid():
        serializer(padre=padre_obj)  # Asignar el padre al serializer
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])  # Elimina el Usuario
# Solo admins pueden eliminar usuarios
@permission_classes([IsAuthenticated, IsAdminUser])
def eliminar_usuario(request, pk):
    """
    Endpoint para que un administrador elimine un usuario por su ID.

    Args:
        request: Objeto de petición HTTP (usuario debe ser admin)
        pk: ID del usuario a eliminar

    Returns:
        Response: Mensaje de confirmación o error
    """
    try:

        padre = Padres.objects.get(pk=pk)
        user = padre.usuario
        padre.delete()
        user.delete()  # Eliminar el usuario asociado
        return Response({'message': 'Formulario y Usuario eliminado exitosamente'}, status=status.HTTP_200_OK)
    except Padres.DoesNotExist:
        # Si no existe, retornar error 404
        return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Otros errores
        return Response({'error': f'Error eliminando usuario: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PATCH'])  # Solo acepta peticiones PATCH
# Solo admins pueden aprobar
@permission_classes([IsAuthenticated, IsAdminUser])
def aprobar_padre(request, pk):
    """
    Endpoint para que un administrador apruebe a un padre.

    Args:
        request: Objeto de petición HTTP (usuario debe ser admin)
        pk: ID del padre a aprobar

    Returns:
        Response: Padre aprobado o mensaje de error
    """
    try:
        padre = Padres.objects.get(pk=pk)  # Obtener el padre por ID
    except Padres.DoesNotExist:
        # Si no existe, retornar error 404
        return Response({'error': 'Padre no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    # Obtener el campo 'aprobado' del cuerpo de la petición
    aprobado = request.data.get('aprobado')
    if aprobado is None:
        # Si no se envía el campo, retornar error 400
        return Response({'error': 'Campo "aprobado" es obligatorio'}, status=status.HTTP_400_BAD_REQUEST)

    padre.aprobado = bool(aprobado)  # Actualizar el estado de aprobación
    padre.save()  # Guardar los cambios

    return Response({
        # Mensaje de éxito
        "message": f"Padre {'aprobado' if padre.aprobado else 'desaprobado'} exitosamente",
        "padre": PadresSerializer(padre).data

    }, status=status.HTTP_200_OK)  # Retornar el padre actualizado

# ============================================================================
# VISTAS PARA CRUD DE PADRES
# ============================================================================


class PadresListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los padres y crear nuevos padres.

    GET: Retorna lista de todos los padres
    POST: Crea un nuevo padre
    """
    queryset = Padres.objects.all()  # Todos los padres
    serializer_class = PadresSerializer  # Serializer a usar
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados


class PadresDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un padre específico.

    GET: Retorna datos de un padre específico
    PUT/PATCH: Actualiza datos de un padre
    DELETE: Elimina un padre
    """
    queryset = Padres.objects.all()  # Todos los padres
    serializer_class = PadresSerializer  # Serializer a usar
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados


# ============================================================================
# VISTAS PARA CRUD DE ESTUDIANTES
# ============================================================================

class EstudiantesListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los estudiantes y crear nuevos estudiantes.

    GET: Retorna lista de todos los estudiantes
    POST: Crea un nuevo estudiante
    """
    queryset = Estudiantes.objects.all()  # Todos los estudiantes
    serializer_class = EstudiantesSerializer  # Serializer a usar
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados


class EstudiantesDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un estudiante específico.

    GET: Retorna datos de un estudiante específico
    PUT/PATCH: Actualiza datos de un estudiante
    DELETE: Elimina un estudiante
    """
    queryset = Estudiantes.objects.all()  # Todos los estudiantes
    serializer_class = EstudiantesSerializer  # Serializer a usar
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados


# ============================================================================
# VISTAS PARA CRUD DE TUTORES RECEPTORES
# ============================================================================

class TutorReceptorListCreateView(generics.ListCreateAPIView):
    """
    Vista para listar todos los tutores receptores y crear nuevos tutores.

    GET: Retorna lista de todos los tutores
    POST: Crea un nuevo tutor
    """
    queryset = Tutor_receptor.objects.all()  # Todos los tutores
    serializer_class = TutorReceptorSerializer  # Serializer a usar
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados


class TutorReceptorDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para obtener, actualizar o eliminar un tutor específico.

    GET: Retorna datos de un tutor específico
    PUT/PATCH: Actualiza datos de un tutor
    DELETE: Elimina un tutor
    """
    queryset = Tutor_receptor.objects.all()  # Todos los tutores
    serializer_class = TutorReceptorSerializer  # Serializer a usar
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados


class FormulariosAdminView(generics.ListAPIView):
    """
    Vista para que los administradores vean todos los formularios enviados por los padres.

    GET: Retorna lista de todos los formularios con estudiantes y tutores anidados
    """
    queryset = Padres.objects.all()  # Todos los padres (formularios)
    serializer_class = FormularioSerializer  # Serializer a usar
    # Solo admins pueden acceder
    permission_classes = [IsAuthenticated, IsAdminUser]


class FromularioDetailAdminView(generics.RetrieveDestroyAPIView):
    """
    Vista para que los administradores vean o eliminen un formulario específico.

    GET: Retorna datos de un formulario específico con estudiantes y tutores anidados
    DELETE: Elimina un formulario específico
    """
    queryset = Padres.objects.all()  # Todos los padres (formularios)
    serializer_class = FormularioSerializer  # Serializer a usar
    # Solo admins pueden acceder
    permission_classes = [IsAuthenticated, IsAdminUser]
