# Generated by Django 3.1.8 on 2021-08-15 15:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0010_site_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='emprunt',
            name='date_fin',
            field=models.DateTimeField(null=True),
        ),
    ]