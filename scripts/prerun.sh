#!/bin/bash

# set error
set -e

echo "Starting Docker containers..."
docker compose down
npm run $1:docker

echo "Waiting for MySQL to be ready..."
until mysqladmin ping -h localhost --port=$MYSQL_PORT --protocol=TCP --silent; do
    echo "⌛ Still waiting..."
    echo "⏳ ..."
    echo ""
    sleep 2
done

echo "Liquibase update..."
npm run $1:liquibase:update

echo "Prisma run..."
npm run $1:prisma:run