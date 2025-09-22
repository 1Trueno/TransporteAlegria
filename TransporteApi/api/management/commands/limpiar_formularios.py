from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import Padres


class Command(BaseCommand):
    help = 'Elimina formularios no aprobados que han expirado'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dias',
            type=int,
            default=30,
            help='Número de días después de los cuales eliminar formularios no aprobados (default: 30)',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Mostrar qué se eliminaría sin eliminar realmente',
        )

    def handle(self, *args, **options):
        dias_expiracion = options['dias']
        dry_run = options['dry_run']
        
        # Calcular fecha límite
        fecha_limite = timezone.now() - timedelta(days=dias_expiracion)
        
        # Buscar formularios no aprobados que han expirado
        formularios_expirados = Padres.objects.filter(
            aprobado=False,
            fecha_formulario__lt=fecha_limite
        )
        
        cantidad = formularios_expirados.count()
        
        if cantidad == 0:
            self.stdout.write(
                self.style.SUCCESS('No hay formularios expirados para eliminar.')
            )
            return
        
        if dry_run:
            self.stdout.write(
                self.style.WARNING(f'DRY RUN: Se eliminarían {cantidad} formularios expirados:')
            )
            for formulario in formularios_expirados:
                self.stdout.write(
                    f'  - {formulario.usuario.nombre} {formulario.usuario.apellido} '
                    f'({formulario.usuario.email}) - Creado: {formulario.fecha_formulario}'
                )
        else:
            # Eliminar formularios expirados
            eliminados = 0
            for formulario in formularios_expirados:
                try:
                    # Eliminar el usuario asociado (esto también eliminará el formulario por CASCADE)
                    usuario = formulario.usuario
                    usuario.delete()
                    eliminados += 1
                    self.stdout.write(
                        f'Eliminado: {usuario.nombre} {usuario.apellido} ({usuario.email})'
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f'Error eliminando formulario {formulario.id}: {str(e)}')
                    )
            
            self.stdout.write(
                self.style.SUCCESS(f'Se eliminaron {eliminados} formularios expirados.')
            )
