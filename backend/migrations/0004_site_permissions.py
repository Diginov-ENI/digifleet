# Generated by Django 3.1.8 on 2021-06-03 09:41

from django.db import migrations

def create_content_type(apps, schema_editor):
    ContentType = apps.get_model('contenttypes','ContentType')
    ContentType.objects.create(app_label='backend', model='site')

def create_permissions(apps, schema_editor):
    Permission = apps.get_model('auth','Permission')
    ContentType = apps.get_model('contenttypes','ContentType')

    content = ContentType.objects.get(app_label='backend', model='site')

    Permission.objects.create(name='Création d\'un site', content_type_id=content.id, codename='site_create')
    Permission.objects.create(name='Accès a la liste des sites', content_type_id=content.id, codename='site_list')
    Permission.objects.create(name='Suppression d\'un site', content_type_id=content.id, codename='site_destroy')
    Permission.objects.create(name='Modification d\'un site', content_type_id=content.id, codename='site_update')
    Permission.objects.create(name='Récuperation des informations d\'un site', content_type_id=content.id, codename='site_retrieve')


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0003_site'),
    ]

    operations = [
        migrations.RunPython(create_content_type),
        migrations.RunPython(create_permissions),
    ]
