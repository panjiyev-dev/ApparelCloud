#!/bin/bash
set -e

cd ~/ApparelCloud

git pull origin main

docker-compose down
docker-compose up --build -d

echo "Deploy muvaffaqiyatli!"
