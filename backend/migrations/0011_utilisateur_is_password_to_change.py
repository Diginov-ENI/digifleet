# Generated by Django 3.1.8 on 2021-08-13 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_site_is_active'),
    ]

    operations = [
        migrations.AddField(
            model_name='utilisateur',
            name='is_password_to_change',
            field=models.BooleanField(default=True),
        ),
    ]