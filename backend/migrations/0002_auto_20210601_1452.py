# Generated by Django 3.1.8 on 2021-06-01 14:52

from django.db import migrations

def create_content_type(apps, schema_editor):
    ContentType = apps.get_model('contenttypes','ContentType')
    ContentType.objects.create(app_label='backend', model='utilisateur')

def create_permissions(apps, schema_editor):
    Permission = apps.get_model('auth','Permission')
    ContentType = apps.get_model('contenttypes','ContentType')

    content = ContentType.objects.get(app_label='backend', model='utilisateur')

    Permission.objects.create(name='Création d\'un utilisateur', content_type_id=content.id, codename='utilisateur_create')
    Permission.objects.create(name='Accès a la liste des utilisateurs', content_type_id=content.id, codename='utilisateur_list')
    Permission.objects.create(name='Suppression d\'un utilisateur', content_type_id=content.id, codename='utilisateur_destroy')
    Permission.objects.create(name='Archivage d\'un utilisateur', content_type_id=content.id, codename='utilisateur_archive')
    Permission.objects.create(name='Modification d\'un utilisateur', content_type_id=content.id, codename='utilisateur_update')
    Permission.objects.create(name='Récuperation des informations d\'un utilisateur', content_type_id=content.id, codename='utilisateur_retrieve')

class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_content_type),
        migrations.RunPython(create_permissions),
    ]
