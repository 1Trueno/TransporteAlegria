from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from api.models import Padres


class Command(BaseCommand):
    help = 'Elimina padres (y usuarios) no aprobados con más de N días de antigüedad'

    def add_arguments(self, parser):
        parser.add_argument('--days', type=int, default=7,
                            help='Número de días para considerar expirado')

    def handle(self, *args, **options):
        days = options['days']
        cutoff = timezone.now() - timedelta(days=days)
        to_delete = Padres.objects.filter(
            aprobado=False, created_at__lt=cutoff)
        count = to_delete.count()
        for padre in to_delete:
            user = padre.Usuario
            padre.delete()
            if user:
                user.delete()
        self.stdout.write(self.style.SUCCESS(
            f'Eliminados {count} padres/usuarios no aprobados con más de {days} días.'))
