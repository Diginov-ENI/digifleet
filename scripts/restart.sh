# restart the docker containers
docker-compose -f ./docker/docker-compose.yml up --build --force-recreate -d

# log result
printf "\n######## SERVER RESTARTED ########\n"
printf "Server available at: http://<server-ip>:8000/\n"