# Importaciones necesarias para Django
from django.db import models
from django.contrib.auth.models import AbstractUser  # Modelo base de usuario de Django
from django.contrib.auth.base_user import BaseUserManager  # Manager personalizado para usuarios


class CustomUserManager(BaseUserManager):
    """
    Manager personalizado para el modelo Usuario.
    Permite crear usuarios usando email en lugar de username.
    """
    
    def create_user(self, email, password=None, **extra_fields):
        """
        Crea y guarda un usuario regular con el email y contraseña dados.
        
        Args:
            email: Email del usuario (obligatorio)
            password: Contraseña del usuario (opcional)
            **extra_fields: Campos adicionales del usuario
        
        Returns:
            Usuario creado
        """
        if not email:
            raise ValueError('El email es obligatorio')
        
        # Normaliza el email (convierte a minúsculas, etc.)
        email = self.normalize_email(email)
        
        # Crea el usuario con el email normalizado
        user = self.model(email=email, **extra_fields)
        
        # Encripta la contraseña de forma segura
        user.set_password(password)
        
        # Guarda el usuario en la base de datos
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """
        Crea y guarda un superusuario (administrador) con el email y contraseña dados.
        
        Args:
            email: Email del superusuario
            password: Contraseña del superusuario
            **extra_fields: Campos adicionales
        
        Returns:
            Superusuario creado
        """
        # Establece permisos de administrador por defecto
        extra_fields.setdefault('is_staff', True)  # Puede acceder al admin
        extra_fields.setdefault('is_superuser', True)  # Tiene todos los permisos
        extra_fields.setdefault('role', 'admin')  # Rol de administrador, si aplica
        
        return self.create_user(email, password, **extra_fields)


class Usuario(AbstractUser):
    """
    Modelo de usuario personalizado que extiende AbstractUser de Django.
    Usa email como campo de autenticación principal en lugar de username.
    """
    
    ROLE_CHOICES = (
        ('admin', 'Administrador'),
        ('padre', 'Padre'),
    )

    # Campo de email único (no puede repetirse)
    email = models.EmailField(unique=True)
    
    # Username opcional (puede estar vacío)
    username = models.CharField(max_length=150, blank=True, null=True)
    
    # Campos de información personal
    nombre = models.CharField(max_length=100, blank=True, null=True)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    telefono = models.CharField(max_length=13, blank=True, null=True)

    # Campo para el rol del usuario (admin o padre)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='padre')

    # Fecha de registro automática (se establece al crear el usuario)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    # Campo para verificar si el email está confirmado
    email_verificado = models.BooleanField(default=False)
    
    aprobado = models.BooleanField(default=False)  # Si el usuario está aprobado en el sistema


    # Token de verificación (para confirmar email)
    token_verificacion = models.CharField(max_length=100, blank=True, null=True)
    
    # Configuración para usar email como campo de autenticación
    USERNAME_FIELD = 'email'  # Campo usado para login
    REQUIRED_FIELDS = []      # No hay campos adicionales obligatorios
    
    # Usar nuestro manager personalizado
    objects = CustomUserManager()
    
    def __str__(self):
        """Representación en string del usuario (para admin y debugging)"""
        return self.email


class Padres(models.Model):
    """
    Modelo para almacenar información de los padres de los estudiantes.
    """
    
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, related_name='padre', null=True, blank=True)
    
    # Cédula única (no puede repetirse)
    cedula = models.CharField(max_length=13, unique=True)
    celular = models.CharField(max_length=13, blank=True, null=True)  # Opcional
    
    # Campo para aprobar el formulario del padre
    aprobado = models.BooleanField(default=False)
    
    # Fecha de creación del formulario
    fecha_formulario = models.DateTimeField(auto_now_add=True)
    
    # Fecha de expiración del formulario (se elimina automáticamente después de esta fecha)
    fecha_expiracion = models.DateTimeField(null=True, blank=True, default=None)

    def __str__(self):
        """Representación en string del padre"""
        return f"{self.usuario.nombre} {self.usuario.apellido}"


class Estudiantes(models.Model):
    """
    Modelo para almacenar información de los estudiantes.
    Tiene relación con el modelo Padres.
    """
    
    # Campo de ID automático como clave primaria
    id = models.AutoField(primary_key=True)
    
    # Información personal del estudiante
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()  # Fecha de nacimiento
    grado = models.CharField(max_length=50)  # Grado escolar
    
    # Relación con el modelo Padres (muchos estudiantes pueden tener los mismos padres)
    padres = models.ForeignKey(
        Padres, 
        on_delete=models.CASCADE,  # Si se elimina el padre, se elimina el estudiante
        related_name='estudiantes'  # Permite acceder a los estudiantes desde el padre
    )
    
    # Campos adicionales
    edad = models.IntegerField(blank=True, null=True)  # Opcional
    Colegio = models.CharField(max_length=100, blank=True, null=True)  # Opcional
    H_entrada = models.TimeField(blank=True, null=True)  # Hora de entrada, opcional
    H_salida = models.TimeField(blank=True, null=True)   # Hora de salida, opcional

    def __str__(self):
        """Representación en string del estudiante"""
        return f"{self.nombre} {self.apellido} - {self.grado}"
    

class Tutor_receptor(models.Model):
    """
    Modelo para almacenar información de los tutores receptores.
    Son personas autorizadas para recibir al estudiante.
    Tiene relación con el modelo Estudiantes.
    """
    
    # Campo de ID automático como clave primaria
    id = models.AutoField(primary_key=True)
    
    # Información personal del tutor
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    direccion = models.CharField(max_length=255, blank=True, null=True)  # Opcional
    telefono = models.CharField(max_length=13, blank=True, null=True)    # Opcional
    parentesco = models.CharField(max_length=50, blank=True, null=True)  # Opcional

    # Relación con el modelo Estudiantes (muchos tutores pueden recibir al mismo estudiante)
    estudiante = models.ForeignKey(
        Estudiantes,
        on_delete=models.CASCADE,  # Si se elimina el estudiante, se elimina el tutor
        related_name='tutores_receptores'  # Permite acceder a los tutores desde el estudiante
    )

    def __str__(self):
        """Representación en string del tutor receptor"""
        return f"{self.nombre} {self.apellido} - {self.parentesco} de {self.estudiante.nombre} {self.estudiante.apellido}"