red='\033[0;31m'
green='\033[0;32m'
no_color='\033[0m'
web_container_name='docker_web_1'
db_container_name='docker_db_1'
front_container_name='docker_front_1'
rev_proxy_name='docker_reverse-proxy_1'

if [ "$( docker container inspect -f '{{.State.Status}}' $web_container_name )" == "running" ]
then
        printf "${no_color}$web_container_name           ... ${green}RUNNING\n";
else
        printf "${no_color}$web_container_name           ... ${red}NOT RUNNING\n";
fi

if [ "$( docker container inspect -f '{{.State.Status}}' $db_container_name )" == "running" ]
then
        printf "${no_color}$db_container_name            ... ${green}RUNNING\n";
else
        printf "${no_color}$db_container_name            ... ${red}NOT RUNNING\n";
fi

if [ "$( docker container inspect -f '{{.State.Status}}' $front_container_name )" == "running" ]
then
        printf "${no_color}$front_container_name         ... ${green}RUNNING\n";
else
        printf "${no_color}$front_container_name         ... ${red}NOT RUNNING\n";
fi

if [ "$( docker container inspect -f '{{.State.Status}}' $rev_proxy_name )" == "running" ]
then
        printf "${no_color}$rev_proxy_name ... ${green}RUNNING\n";
else
        printf "${no_color}$rev_proxy_name ... ${red}NOT RUNNING\n";
fi