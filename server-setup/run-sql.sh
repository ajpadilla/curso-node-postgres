#!/bin/bash

SERVICE="postgres_node_platzi"
USER="nico"
DATABASE="my_store"

FILE=$1

if [ -z "$FILE" ]; then
  echo "Usage: ./run-sql.sh sql/file.sql"
  exit 1
fi

docker-compose exec -T "$SERVICE" \
  psql -U "$USER" -d "$DATABASE" < "$FILE"
