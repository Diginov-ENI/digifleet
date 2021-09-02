# restart the docker containers
docker-compose -f ./docker/docker-compose.yml up --build --force-recreate -d

# log result
localIp=$(ip -4 addr | grep -oP '(?<=inet\s)(10)(\.\d+){3}')
printf "\n######## SERVER RESTARTED ########\n"
printf "Server available at: http://$localIp:8000/\n"