# Generated by Django 3.1.8 on 2021-06-05 15:55

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0006_vehicule_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='Emprunt',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_demande', models.DateTimeField(auto_now_add=True)),
                ('date_debut', models.DateTimeField()),
                ('date_fin', models.DateTimeField()),
                ('statut', models.CharField(max_length=15)),
                ('destination', models.CharField(max_length=500)),
                ('commentaire', models.CharField(max_length=2000)),
                ('type', models.CharField(max_length=1)),
                ('conducteur', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='emprunts', to=settings.AUTH_USER_MODEL)),
                ('passagers', models.ManyToManyField(related_name='covoits', to=settings.AUTH_USER_MODEL)),
                ('site', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, to='backend.site')),
            ],
        ),
    ]
