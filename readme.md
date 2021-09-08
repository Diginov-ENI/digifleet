# Digifleet
Application de gestion de flotte de véhicules conçue par l'entreprise fictive **Diginov'**

Développé en Django (python) et Angular (typescript)

## Fonctionalités Majeures
* Dépôt de demandes d'emprunts de véhicules (choix du site de rattachement, du lieu d'arrivé, des dates de départ/arrivé et des passagers)
* Suivi et validation des demandes (validation, attribution de véhicule, refus, annulation, suivi des clefs)
* Gestion et Administration des utilisateurs, sites, véhicules et permissions d'accès

Conçu et développé par:
* [Claire GAUDET](https://github.com/Floue)
* [Grégory BOUTTE](https://github.com/gboutte)
* [Fabien BARTHAS](https://github.com/noobzor)
* [Bastien LELODET](https://github.com/bastienLelodet)
* [Maxence MILLOT](https://github.com/MaxenceMillot)

Logiciel disponible ici : https://github.com/Diginov-ENI/digifleet/releases/

# Déploiement de PRODUCTION
## Mettre en place le projet

### Déploiement Linux
1. Installer docker - https://www.docker.com/get-started
    - `sudo apt install docker.io`
2. Installer docker-compose
    - `sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
    - `sudo chmod +x /usr/local/bin/docker-compose`
    - `sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose`
3. Télécharger la dernière release de Digifleet - https://github.com/Diginov-ENI/digifleet/releases
4. Se déplacer dans la racine du projet
5. Exécuter le script suivant : `sudo bash scripts/init_env.sh`
6. Ouvrir `docker/.env` et remplacer `<server-ip>` par l'adresse de la machine hôte
7. Exécuter le script suivant : `sudo bash scripts/init_docker.sh`
8. Vérifier le bon fonctionnement des conteneurs : `sudo bash scripts/status.sh`
9. Exécuter le script suivant : `sudo bash scripts/init_db.sh`
10. Modifier le fichier `docker/.env` et dans le champ `FRONT_API_URL` remplacer "localhost" par l'ip du serveur hôte (pour rendre l'appli fonctionnelle sur un réseau local)
11. Configurer Sentry pour les logs (cf: manuel d'installation)
12. Se rendre sur `<ip-hôte>:8000` pour vérifier que l'application se lance avec succès

### Déploiement Windows
1. Installer docker et le lancer - https://www.docker.com/get-started
2. Télécharger la dernière release de Digifleet - https://github.com/Diginov-ENI/digifleet/releases
3. Se déplacer dans la racine du projet
4. Écrire les fichiers d'environnement (depuis la documentation)
    - `config\.env`
    - `docker\.env`
    - `docker\sentry.env`
5. Vérifier le bon fonctionnement des conteneurs : `sudo docker ps` (ou depuis l'interface docker desktop)
6. Agrémenter la BDD avec les scripts présents dans `backend\migrations\datasets`
5. Modifier le fichier `docker\.env` et dans le champ `FRONT_API_URL` remplacer "localhost" par l'ip du serveur hôte (pour rendre l'appli fonctionelle sur un réseau local)
8. Configurer Sentry pour les logs (cf: manuel d'installation)
9. Se rendre sur `<ip-hôte>:8000` pour vérifier que l'application se lance avec succès

### Scripts shell
Les scripts shells permettent la gestion du serveur (sous Linux **uniquement**)
- `init_docker.sh` - (à usage unique) - permet l'installation des images docker et des contanineurs ainsi que la configuration de la BDD
- `init_db.sh` - (à usage unique) - Insert les données de base dans l'aplication
- `status.sh` - Affiche l'état des conteneurs principaux
- `restart.sh` - Redémmare tous les conteneurs
- `stop.sh` - Arrête tous les conteneurs
