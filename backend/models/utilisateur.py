from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

# model GestionnaireUtilisateur
"""
modele GestionnaireUtilisateur

Surcouche nécéssaire à la gestion de l'authentification des utilisateurs
"""
class GestionnaireUtilisateur(BaseUserManager):
    def create_user(self, email, username, nom, prenom, password):
        """
        Creates and saves a User with the given email, nom, prenom and password.
        """
        if not email:
            raise ValueError('The given email must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, nom=nom, prenom=prenom, is_active=True)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, nom, prenom, password):
        """
        Creates and saves a SuperUser with the given email, nom, prenom and password.
        """
        if not email:
            raise ValueError('The given email must be set')

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, nom=nom, prenom=prenom, is_active=True, is_superuser=True)
        user.set_password(password)
        user.save(using=self._db)
        return user

# model Utilisateur
class Utilisateur(AbstractBaseUser,  PermissionsMixin):
    email = models.EmailField(max_length=200, unique=True)
    username = models.CharField(max_length=200, unique=True)
    nom = models.CharField(max_length=200)
    prenom = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)

    objects = GestionnaireUtilisateur()

    # Required implementation fields for AbstracBaseUser
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nom', 'prenom']
    
    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission ?"
        return self.user_permissions

    