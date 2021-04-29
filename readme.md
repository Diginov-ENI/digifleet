# Déploiement
### :warning: Procédure de déploiement pour l'environnement de **DEV** 

## Mettre en place le projet
1. Installer docker et le lancer - https://www.docker.com/get-started
2. Cloner le repo depuis la branche **develop** ou checkout vers une autre branche
3. Au premier clonage, executer `git config --global core.autocrlf false`
4. Créer le fichier `config/.env`
```
DJANGO_SECRET_KEY=
DJANGO_DEBUG=
DATABASE_URL=
```
3. Créer le fichier `docker/.env`
```
PORT=
PORT_DB=
SENTRY_DSN_BACK=
SENTRY_DSN_FRONT=
```
4. Créer le fichier `docker/sentry.env`
```
SENTRY_POSTGRES_HOST=sentry-postgres
SENTRY_DB_USER=sentry
SENTRY_DB_PASSWORD=sentry
SENTRY_REDIS_HOST=sentry-redis
SOCIAL_AUTH_REDIRECT_IS_HTTPS=false
SENTRY_SECRET_KEY=
```
5. Récupérer les informations des fichiers `.env` dans la **documentation technique** (les *.env* ne doivent **JAMAIS** être push sur le repo)
6. Se déplacer dans le répertoir `docker/`
7. Depuis un terminal exécuter la commande suivante : `docker-compose up --build`
8. Ouvrir l'interface Docker et cliquer sur le conteneur `docker_web`
9. Cliquer sur l'icone CLI en haut à droit pour ouvrir un terminal dans le conteneur web
10. Executer : `python manage.py makemigrations`
11. Executer : `python manage.py migrate`
12. Stopper les conteneur Docker
13. Relancer les conteneur Docker (voir étape 7)
14. Se rendre sur `localhost:8000` pour vérifier que l'application se lance avec succès

## Pour commencer le développement, consulter `getting_started.md`
## Pour mettre en place le projet depuis zéro, consulter `setup.md`
___

## Procédure de déploiement pour l'environnement de **PROD**
* When it comes time to deploy the project, create a separate docker-compose file that will not be committed.
* Close database listening ports ? or restrict to localhost
* fichier `docker-entrypoint.sh` pour configurer un script au démarrage du container
* wait-for ou wait-for-it pour déploiement officiel : https://docs.docker.com/compose/startup-order/
* https://docs.djangoproject.com/en/3.1/howto/deployment/checklist/
___
### Sources
* https://medium.com/swlh/setting-up-a-secure-django-project-repository-with-docker-and-django-environ-4af72ce037f0
* https://learndjango.com/tutorials/django-docker-and-postgresql-tutorial
* ~~https://www.django-rest-framework.org/tutorial/quickstart/~~ next one is more detailed
* https://www.django-rest-framework.org/tutorial/1-serialization/
