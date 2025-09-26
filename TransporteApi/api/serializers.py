# Importaciones necesarias para Django REST Framework
from rest_framework import serializers
from django.contrib.auth import authenticate  # Para autenticar usuarios
from .models import Usuario, Padres, Estudiantes, Tutor_receptor  # Nuestros modelos


class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar información del usuario.
    Solo incluye campos seguros para mostrar públicamente.
    """
    class Meta:
        model = Usuario  # Modelo que serializa
        fields = ['id', 'email', 'nombre', 'apellido', 'telefono',
                  'fecha_registro', 'email_verificado', 'role']  # Campos a incluir
        # Campos que no se pueden modificar
        read_only_fields = ['id', 'fecha_registro', 'email_verificado']


class RegistroSerializer(serializers.ModelSerializer):
    """
    Serializer para el registro de nuevos usuarios.
    Incluye validación de contraseñas y creación de usuarios.
    """
    # Campo de contraseña (solo escritura, no se muestra en respuestas)
    password = serializers.CharField(write_only=True, min_length=6)

    # Campo de confirmación de contraseña
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario  # Modelo que serializa
        fields = ['email', 'password', 'confirm_password', 'nombre',
                  'apellido', 'telefono']  # Campos del formulario

    def validate(self, attrs):
        """
        Valida que las contraseñas coincidan antes de crear el usuario.

        Args:
            attrs: Diccionario con los datos del formulario

        Returns:
            attrs: Datos validados

        Raises:
            ValidationError: Si las contraseñas no coinciden
        """
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return attrs

    def create(self, validated_data):
        """
        Crea un nuevo usuario con los datos validados.

        Args:
            validated_data: Datos validados del formulario

        Returns:
            Usuario creado
        """
        # Elimina el campo de confirmación de contraseña (no es parte del modelo)
        validated_data.pop('confirm_password')

        # Crea el usuario usando el manager personalizado
        user = Usuario.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer para el login de usuarios.
    Valida credenciales y autentica al usuario.
    """
    # Campos del formulario de login
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        """
        Valida las credenciales del usuario.

        Args:
            attrs: Diccionario con email y contraseña

        Returns:
            attrs: Datos validados con el usuario autenticado

        Raises:
            ValidationError: Si las credenciales son inválidas
        """
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            # Intenta autenticar al usuario
            user = authenticate(email=email, password=password)
            if not user:
                raise serializers.ValidationError('Credenciales inválidas')

            # Agrega el usuario autenticado a los datos
            attrs['user'] = user
        else:
            raise serializers.ValidationError(
                'Debe proporcionar email y contraseña')

        return attrs


class PadresSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Padres.
    Permite crear, leer, actualizar y eliminar padres.
    """
    class Meta:
        model = Padres  # Modelo que serializa
        fields = '__all__'  # Incluye todos los campos del modelo
        read_only_fields = ['aprobado', 'fecha_formulario',
                            'fecha_expiracion']  # Campos de solo lectura


class EstudiantesSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Estudiantes.
    Permite crear, leer, actualizar y eliminar estudiantes.
    """
    class Meta:
        model = Estudiantes  # Modelo que serializa
        fields = ['id', 'nombre', 'apellido', 'fecha_nacimiento', 'grado', 'edad',
                  'colegio', 'H_entrada', 'H_salida']  # Campos que necesito del modelo


class TutorReceptorSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Tutor_receptor.
    Permite crear, leer, actualizar y eliminar tutores receptores.
    """
    class Meta:
        model = Tutor_receptor  # Modelo que serializa
        fields = ['id', 'nomnbre', 'apelido', 'direccion', 'telefono',
                  'parentesco', 'estudiante']  # Campos que necesito del modelo


class FormularioSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar formularios completos con estudiantes y tutores.
    """
    estudiantes = EstudiantesSerializer(many=True, read_only=True)
    tutores_receptores = TutorReceptorSerializer(many=True, read_only=True)

    class Meta:
        model = Padres
        fields = ['id', 'cedula', 'celular', 'aprobado', 'fecha_formulario',
                  'fecha_expiracion', 'estudiantes', 'tutores_receptores']
        read_only_fields = ['aprobado']

    def create(self, validated_data):
        estudiantes_data = validated_data.pop('estudiantes', [])
        tutores_data = validated_data.pop('tutores_receptores', [])

        padre = self.context.get(
            'padre') or self.initial_data.get('padre_instance')
        if not padre:
            padre = Padres.objects.create(**validated_data)

        padre.cedula = validated_data.get('cedula', padre.cedula)
        padre.celular = validated_data.get('celular', padre.celular)
        padre.save()

        # crear estudiantes y tutores
        crear_estudiantes = []
        for est in estudiantes_data:  # Crear estudiantes y guardarlos en una lista
            estudiante = Estudiantes.objects.create(padres=padre, **est)
            crear_estudiantes.append(estudiante)
        # Si el tutor viene sin el id del estudiante, asignarlo

        for tutor in tutores_data:
            estudiante_id = tutor.pop('estudiante_id', None)
            if estudiante_id:
                try:  # Buscar el estudiante por ID y padre
                    estudiante = Estudiantes.objects.get(
                        id=estudiante_id, padres=padre)
                except Estudiantes.DoesNotExist:
                    estudiante_obj = crear_estudiantes[0] if crear_estudiantes else None
            else:  # Asignar el primer estudiante creado si no se proporciona ID
                estudiante_obj = crear_estudiantes[0] if crear_estudiantes else None

            if estudiante_obj:  # Asignar el estudiante creado
                Tutor_receptor.objects.create(
                    estudiante=estudiante_obj, **tutor)

        # retornar el padre con los datos actualizados
        return padre

    def update(self, instance, validated_data):
        estudiantes_data = validated_data.pop('estudiantes', [])
        tutores_data = validated_data.pop('tutores_receptores', [])

        instance.cedula = validated_data.get('cedula', instance.cedula)
        instance.celular = validated_data.get('celular', instance.celular)
        instance.save()

        # Actualizar estudiantes

        for est_data in estudiantes_data:
            est_id = est_data.get('id', None)
            if est_id:
                Estudiantes.objects.filter(id=est_id, padres=instance).update(
                    **{k: v for k, v in est_data.items() if k != 'id'})
            else:
                Estudiantes.objects.create(padres=instance, **est_data)
        
        # Actualizar tutores o cra tutores
        for tutor_data in tutores_data: 
            tutor_id = tutor_data.get('id', None)
            if tutor_id:
                Tutor_receptor.objects.filter(id=tutor_id, estudiante__padres=instance).update(
                    **{k: v for k, v in tutor_data.items() if k != 'id'})
            else: # Si no tiene ID, crear un nuevo tutor
                estudiante_id = tutor_data.pop('estudiante_id', None)
                if estudiante_id: # Si se proporciona el ID del estudiante
                    try: # Buscar el estudiante por ID y padre
                        estudiante_obj = Estudiantes.objects.get(id=estudiante_id, padres=instance)
                        Tutor_receptor.objects.create(estudiante=estudiante_obj, **tutor_data)
                    except Estudiantes.DoesNotExist:
                        pass
        return instance


class EnvioFormularioSerializer(serializers.Serializer):
    """
    Serializer para el envío de formularios por parte de los padres.
    """
    cedula = serializers.CharField(max_length=13)
    celular = serializers.CharField(max_length=13, required=False)
    estudiantes = EstudiantesSerializer(many=True)
    tutores_receptores = TutorReceptorSerializer(many=True)

    def create(self, validated_data):
        """
        Crea un nuevo formulario con estudiantes y tutores.
        """
        # Extraer datos anidados
        estudiantes_data = validated_data.pop('estudiantes')
        tutores_data = validated_data.pop('tutores_receptores')

        # Obtener el usuario actual del contexto
        user = self.context['request'].user

        # Crear o actualizar el padre
        padre, created = Padres.objects.get_or_create(
            usuario=user,
            defaults={
                'cedula': validated_data['cedula'],
                'celular': validated_data.get('celular', ''),
            }
        )

        if not created:
            # Si ya existe, actualizar datos
            padre.cedula = validated_data['cedula']
            padre.celular = validated_data.get('celular', '')
            padre.save()

        # Eliminar estudiantes y tutores existentes
        padre.estudiantes.all().delete()

        # Crear nuevos estudiantes y tutores
        for est_data in estudiantes_data:
            estudiante = Estudiantes.objects.create(padres=padre, **est_data)

            # Crear tutores para este estudiante
            for tutor_data in tutores_data:
                if tutor_data.get('estudiante_id') == est_data.get('id'):
                    Tutor_receptor.objects.create(
                        estudiante=estudiante, **tutor_data)

        return padre
