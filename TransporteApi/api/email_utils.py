# Utilidades para el envío de emails
import random
import string
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def generar_token_verificacion():
    """
    Genera un token aleatorio para verificación de email.
    
    Returns:
        str: Token de 32 caracteres
    """
    # Generar 32 caracteres aleatorios (letras y números)
    caracteres = string.ascii_letters + string.digits
    token = ''.join(random.choice(caracteres) for _ in range(32))
    return token


def enviar_email_verificacion(usuario):
    """
    Envía un email de verificación al usuario registrado.
    
    Args:
        usuario: Instancia del modelo Usuario
    
    Returns:
        bool: True si el email se envió correctamente, False en caso contrario
    """
    try:
        # Generar token de verificación
        token = generar_token_verificacion()
        
        # Guardar el token en el usuario
        usuario.token_verificacion = token
        usuario.save()
        
        # Construir el enlace de verificación
        link_verificacion = f"http://localhost:8000/api/auth/verificar-email/{token}/"
        
        # Asunto del email
        asunto = "Verifica tu cuenta - Transporte Alegría"
        
        # Contenido HTML del email
        contenido_html = f"""
        <html>
        <body>
            <h2>¡Bienvenido a Transporte Alegría!</h2>
            <p>Hola {usuario.nombre or 'Usuario'},</p>
            <p>Gracias por registrarte en nuestro sistema. Para completar tu registro, 
            necesitas verificar tu dirección de email.</p>
            
            <p><strong>Haz clic en el siguiente enlace para verificar tu cuenta:</strong></p>
            <p><a href="{link_verificacion}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Verificar Mi Cuenta
            </a></p>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p>{link_verificacion}</p>
            
            <p>Si no te registraste en Transporte Alegría, puedes ignorar este email.</p>
            
            <p>Saludos,<br>Equipo de Transporte Alegría</p>
        </body>
        </html>
        """
        
        # Contenido de texto plano (para emails que no soporten HTML)
        contenido_texto = strip_tags(contenido_html)
        
        # Enviar el email
        send_mail(
            subject=asunto,
            message=contenido_texto,
            html_message=contenido_html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            fail_silently=False,
        )
        
        return True
        
    except Exception as e:
        print(f"Error enviando email: {e}")
        return False


def enviar_email_bienvenida(usuario):
    """
    Envía un email de bienvenida después de verificar la cuenta.
    
    Args:
        usuario: Instancia del modelo Usuario
    
    Returns:
        bool: True si el email se envió correctamente, False en caso contrario
    """
    try:
        # Asunto del email
        asunto = "¡Cuenta verificada exitosamente! - Transporte Alegría"
        
        # Contenido HTML del email
        contenido_html = f"""
        <html>
        <body>
            <h2>¡Cuenta verificada exitosamente!</h2>
            <p>Hola {usuario.nombre or 'Usuario'},</p>
            <p>Tu cuenta ha sido verificada correctamente. Ya puedes acceder a todas las 
            funcionalidades de Transporte Alegría.</p>
            
            <p><strong>Accede a tu cuenta:</strong></p>
            <p><a href="http://localhost:3000/login" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Iniciar Sesión
            </a></p>
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            
            <p>Saludos,<br>Equipo de Transporte Alegría</p>
        </body>
        </html>
        """
        
        # Contenido de texto plano
        contenido_texto = strip_tags(contenido_html)
        
        # Enviar el email
        send_mail(
            subject=asunto,
            message=contenido_texto,
            html_message=contenido_html,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[usuario.email],
            fail_silently=False,
        )
        
        return True
        
    except Exception as e:
        print(f"Error enviando email de bienvenida: {e}")
        return False
