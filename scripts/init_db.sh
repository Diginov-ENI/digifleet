# Enter dataset
# container must be running !
docker exec -it docker_db_1 mkdir ../datasets
docker cp ./backend/migrations/datasets/insert_users.sql docker_db_1:datasets/insert_users.sql
docker cp ./backend/migrations/datasets/insert_users.sql docker_db_1:datasets/insert_groups.sql
docker exec -t docker_db_1 psql -U postgres -d postgres -f ./datasets/insert_users.sql
docker exec -t docker_db_1 psql -U postgres -d postgres -f ./datasets/insert_groups.sql

# log result
printf "\nUsers and groups successfully inserted in database\n"