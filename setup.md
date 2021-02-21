## How to setup this project from zero
This file explain how to setup the whole project from scratch

:information_source: Most of the commands have been tested with Git CLI but some of them cannot be run inside TTY (use native CLI instead)

____
### Setting up the backend
##### 01.  Install Python (version 3 and above)

##### 02.  Create a workspace

##### 03. Create project folder
`mkdir myProject`

`cd myProject`

##### 04. Create new python virtual environment inside workspace
`python -m venv venv`

##### 05. Activate the virtual env
* From GitBash CLI : `source venv/Scripts/activate`
* From Windows terminal : `venv\Scripts\activate.bat` 
* From Linux : `source venv/bin/activate`
* info : you can deactivate the venv with: `deactivate`

##### 06. Add dependencies
* Django framework : `pip install django`
* .env file management for django : `pip install django-environ`
* Needed for PostgresSQL : `pip install psycopg2-binary`
* Rest framework for Django : `pip install djangorestframework`

##### 07. Generate dependency management file (*requirements.txt*)
`pip freeze > requirements.txt`

##### 08. Create django project
`django-admin startproject config`

This creates the project on a subdirectory `config/config/` which is **not** what we want.

##### 09. Move the content of `config/` so that your entire project looks like this :
![project structure](https://puu.sh/Hcn0v/9fb145f30e.png)

:information_source: Don't worry about the \_\_pycache__ folder as it will be generated later.

##### 10. Creating .env file to secure our environment variables with django-environ
`touch config/.env`

##### 11. Edit `config/settings.py` file and add theses 3 #new lines
```
(...)

from pathlib import Path
from environ import Env               #new

env = Env()                           #new
env.read_env(env_file='config/.env')  #new

(...)
```

##### 12. Inside `settings.py` copy the values of **SECRET_KEY** and **DEBUG** var to the .env file like below
```
DJANGO_SECRET_KEY='MySecretKey'
DJANGO_DEBUG=True
```
##### 13. Replace the values in `config/settings.py`
```
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DJANGO_DEBUG', default=False)
```

#### 14. Execute `django-admin startapp backend`

#### 15. Remove models.py with `rm backend/models.py`

#### 16. Create a directory and an init.py for models
`mkdir backend/models && touch backend/models/__init__.py`

#### 17. Add our `backend` app and the `rest_framework` app to `INSTALLED_APPS` inside `config/settings.py`
```
INSTALLED_APPS = [
    ...
    'rest_framework',
    'backend.apps.BackendConfig',
]
```

##### 18. Save everything and try to run the server with
`python manage.py runserver`

=> Go to http://localhost:8000 to check that everything is working - you should see django startpage

##### 19. Now change the **DATABASES** value in `settings.py` with the code bellow:
```
# before
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3'
    }
}

# after
DATABASES = {
    'default': env.db()
}
```

##### 20. Then add this line to your `.env`
`DATABASE_URL=`

Fill the database URL with the info found in the **Technical Sheet** (.env data should NEVER be pushed to a repo)

**Using the following format** : postgres://{user}:{password}@{hostname}:{port}/{database-name}

____
### Setting up the frontend
#### 21. Install node.js LTS (v14) from `https://nodejs.org/`

#### 22. Install Ionic
`npm install -g @ionic/cli`

#### 23. Create frontend project with `ionic start frontend` (Angular, blank, N)
Warning : doesn't work inside Git CLI !

#### 24. Move to frontend directory
`cd frontend`

#### 25. Create a `web/` directoy and an `index.html` within
`mkdir www && touch www/index.html`

#### 26. Add the  **android** platform
`ionic capacitor add android`

#### 27. Test that your frontend is working
Run `ionic serve` and go to http://localhost:8000/home to check that everything is working - you should see angular startpage

Quit with `CTRL+C`
____
### Containerizing with Docker
##### 28. Create `docker` directory at the root of the project
`mkdir docker`

##### 29. Inside `docker/` create a file `docker-compose.yml`
`cd docker`
`touch docker-compose.yml`

And edit it as follow :
```
version: '3.9'
services:
  db:
    image: postgres:13
    volumes:
      - ./database/data:/var/lib/postgresql/data/
    restart: always
    environment:
      - "POSTGRES_HOST_AUTH_METHOD=trust"
      - "POSTGRES_DB=postgres"
      - "POSTGRES_USER=postgres"
      - "POSTGRES_PASSWORD=postgres"
    ports:
      - "${PORT_DB}:5432"
  web:
    build:
      context: ./web
    command: python /code/manage.py runserver 0.0.0.0:8000
    volumes:
      - ../:/code
    restart: always
    depends_on:
        - db
  front:
    build:
      context: ../
      dockerfile: ./docker/angular/Dockerfile
    command: ionic serve --external
    volumes:
      - ../frontend:/frontend
      - /frontend/node_modules
  reverse-proxy:
    build:
      context: ./nginx
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d/:/etc/nginx/conf.d
      - ./logs/nginx:/var/log/nginx
    ports:
      - "${PORT}:8888"
    depends_on:
      - web
      - front
```

#### 30. Create 4 subdirectories in the `docker` directory
`mkdir web database nginx angular`

#### 31. Move `requirements.txt` to `docker/web/`

#### 32. Inside `docker/web` create a file `Dockerfile`
`touch Dockerfile`

And edit it as follow :
```
# Pull a base image
FROM python:3.9-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Create a working directory for the django project
WORKDIR /django

# Install dependencies
COPY requirements.txt /django/
RUN pip install -r requirements.txt

# Copy the project files into the working directory
COPY . /django/
WORKDIR /code

# Open a port on the container
EXPOSE 8000
```

#### 33. Inside `docker/nginx` create a file `Dockerfile`
`touch Dockerfile`

And edit it as follow :
```
FROM nginx:alpine
CMD ["nginx"]
EXPOSE 8888
```

#### 34. Inside`docker/nginx` create a file `nginx.conf` 
```
user nginx;
worker_processes 4;
daemon off;

error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  access_log /var/log/nginx/access.log;
  include /etc/nginx/conf.d/*.conf;
  server {
    listen 8888;


    location  /api {
      proxy_pass http://django;
      proxy_redirect     off;
      proxy_set_header   Host $host;
    }

    location  / {
      proxy_pass http://angular;
      proxy_redirect     off;
      proxy_set_header   Host $host;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";
    }
  }
}
```

#### 35. Inside `docker/nginx` create a subdirectory `conf.d` and a the file `default.conf`
`mkdir conf.d && touch conf.d/default.conf`

And edit it as follow :
```
upstream django{
  server web:8000;
}
upstream angular{
  server front:8100;
}
```

#### 36. Edit `config/settings.py` as follow
`STATIC_URL = '/api/static/'`

#### 37. Edit `config/urls.py` as follow :
**FIXME** : not doable without proper model -- skip for now
```
from django.contrib import admin
from django.contrib.auth.models import User
from django.urls import path, include


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('api/admin/', admin.site.urls),
    # path('api/', include(router.urls)),
    # path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
```

#### 38. Inside `docker/angular` create a file `Dockerfile`
`touch Dockerfile`

And edit it as follow :
```
FROM node:12.7-alpine
RUN npm install -g @ionic/cli
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install
COPY ./frontend .
EXPOSE 8100
```
#### 39. Create a .env inside docker directory
edit is as follow: 
```
PORT=
PORT_DB=
```

Fill the database URL with the info found in the **Technical Sheet** (.env data should NEVER be pushed to a repo)

##### 40. Finaly, run the containers :
`docker-compose up --build`

:information_source: If container `web` fails to connect to database, rerun `docker-compose up --build` and see : https://docs.docker.com/compose/startup-order/

___
### Initialize basic database schema
#### 41. Run bash inside `web` container
1. **DO NOT** use GitBash CLI as it won't be able to process the next commands
2. Get ID of running `web` container with command line : `docker ps`
3. Then execute `docker exec -it my_ID bash` (not allowed from GitBash CLI)


#### 42. Update database schema from model
2. From web container bash execute `python manage.py migrate`

:point_right:  Go to http://localhost:8000/api/admin and try to login - if there is no error everything is OK

___
### Initializing a git repo

##### 43. init project and gitirno
`git init && touch .gitignore`

##### 44. Add the .env to the .gitignore file
```
# local environments
.env
```
Below is a more complete .gitignore exemple 
```
# Django #
*.log
*.pot
*.pyc
__pycache__
db.sqlite3
media

# Backup files # 
*.bak 

# Python # 
*.py[cod] 
*$py.class 

# Distribution / packaging 
.Python build/ 
develop-eggs/ 
dist/ 
downloads/ 
eggs/ 
.eggs/ 
lib/ 
lib64/ 
parts/ 
sdist/ 
var/ 
wheels/ 
*.egg-info/ 
.installed.cfg 
*.egg 
*.manifest 
*.spec 

# Installer logs 
pip-log.txt 
pip-delete-this-directory.txt 

# Unit test / coverage reports 
htmlcov/ 
.tox/ 
.coverage 
.coverage.* 
.cache 
.pytest_cache/ 
nosetests.xml 
coverage.xml 
*.cover 
.hypothesis/ 

# Jupyter Notebook 
.ipynb_checkpoints 

# pyenv 
.python-version 

# venv
venv/

# celery 
celerybeat-schedule.* 

# SageMath parsed files 
*.sage.py 

# Environments 
.env
*.env

# mkdocs documentation 
/site 

# mypy 
.mypy_cache/ 

# sftp configuration file 
sftp-config.json 

#### Package control specific files Package 
Control.last-run 
Control.ca-list 
Control.ca-bundle 
Control.system-ca-bundle 
GitHub.sublime-settings 
```
##### 45. You can create a readme file with the info on how to start the project:
`touch README.md`
```
### How to setup the project
1. 
2.
3.
____

### Sources
* 
*
*
```

#### Your project is now readdy to be commited and pushed  !
`git add . && git commit -m "Initial commit"`
