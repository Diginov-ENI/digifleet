# Déploiement de PRODUCTION
## Mettre en place le projet

### Déploiement Linux
1. Installer docker - https://www.docker.com/get-started
    - `sudo apt install docker.io`
2. Installer docker-compose
    - `sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
    - `sudo chmod +x /usr/local/bin/docker-compose`
    - `sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose`
3. Télécharger une des release de Digifleet - https://github.com/Diginov-ENI/digifleet/releases
4. Se déplacer dans la racine du projet
5. Exécuter le script suivant : `sudo bash scripts/init_env.sh`
6. Exécuter le script suivant : `sudo bash scripts/init_docker.sh`
7. Vérifier le bon fonctionnement des conteneurs : `sudo docker ps`
8. Exécuter le script suivant : `sudo bash scripts/init_db.sh`
9. Modifier le fichier `./docker/.env` et dans le champ `FRONT_API_URL` remplacer "localhost" par l'ip du serveur hôte (pour rendre l'appli fonctionelle sur un réseau local)
10. Configurer Sentry pour les logs (voir ci-dessous)
11. Se rendre sur `<ip-hôte>:8000` pour vérifier que l'application se lance avec succès


### Déploiement Windows
1. Installer docker et le lancer - https://www.docker.com/get-started
2. Télécharger une des release de Digifleet - https://github.com/Diginov-ENI/digifleet/releases
3. Se déplacer dans la racine du projet
4. Écrire les fichiers d'environnement
    - `config\.env`
    - `docker\.env`
    - `docker\sentry.env`
5. Vérifier le bon fonctionnement des conteneurs : `sudo docker ps` ou depuis l'interface docker desktop
6. Agrémenter la BDD avec les scripts présents dans `backend\migrations\datasets`
5. Modifier le fichier `docker\.env` et dans le champ `FRONT_API_URL` remplacer "localhost" par l'ip du serveur hôte (pour rendre l'appli fonctionelle sur un réseau local)
8. Configurer Sentry pour les logs (voir ci-dessous)
9. Se rendre sur `<ip-hôte>:8000` pour vérifier que l'application se lance avec succès

### Scripts shell
Les scripts shells permettent la gestion du serveur (sous Linux **uniquement**)
- `init_docker.sh` - (à usage unique) - permet l'installation des images docker et des contanineurs ainsi que la configuration de la BDD
- `init_db.sh` - Insert des jeux de données dans l'aplication
- `sstatus.sh` - Affiche l'état des conteneurs principaux
- `restart.sh` - Redémmare tous les conteneurs
- `stop.sh` - Arrête tous les conteneurs
