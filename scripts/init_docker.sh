# startup docker
docker-compose -f ./docker/docker-compose.yml up --build -d

# run migrations
docker exec -it docker_web_1 python manage.py migrate

# restart docker
docker-compose -f ./docker/docker-compose.yml up --build --force-recreate -d

# log result
printf "\n######## INIT FINISHED ########\n"
printf "Server available at: http://$localIp:8000/\n"