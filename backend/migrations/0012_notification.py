# Generated by Django 3.2.6 on 2021-08-23 18:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('backend', '0011_utilisateur_is_password_to_change'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(max_length=255)),
                ('is_read', models.BooleanField(default=False)),
                ('emprunt', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='notification', to='backend.emprunt')),
                ('utilisateur', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, related_name='notification', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
