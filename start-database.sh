#!/usr/bin/env bash
# Start a local Postgres container for dev, using settings from .env

# Use this script to start a docker container for a local development database

# TO RUN ON WINDOWS:
# 1. Install WSL (Windows Subsystem for Linux) - https://learn.microsoft.com/en-us/windows/wsl/install
# 2. Install Docker Desktop for Windows - https://docs.docker.com/docker-for-windows/install/
# 3. Open WSL - `wsl`
# 4. Run this script - `./start-database.sh`

# On Linux and macOS you can run this script directly - `./start-database.sh`

DB_CONTAINER_NAME="welth-app-postgres"

# Check for docker
if ! command -v docker >/dev/null 2>&1; then
    echo "Docker is not installed. Install it: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! docker info >/dev/null 2>&1; then
    echo "Docker daemon is not running. Start Docker and try again."
    exit 1
fi

# Import .env
if [ ! -f .env ]; then
    echo ".env file not found"
    exit 1
fi
# Strip CRLF if needed (Windows files)
tr -d '\r' < .env > .env.tmp && mv .env.tmp .env
set -a
source .env
set +a

# Parse DATABASE_URL safely
# Format: postgresql://user:password@host:port/dbname
if [[ "$DATABASE_URL" =~ ^postgresql:\/\/([^:]+):([^@]+)@([^:\/]+):([0-9]+)\/([^?]+) ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASSWORD="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo "Invalid DATABASE_URL format in .env"
    exit 1
fi

# Generate DIRECT_URL if missing or outdated
LOCAL_DIRECT_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
if grep -q '^DIRECT_URL=' .env; then
    CURRENT_DIRECT_URL=$(grep '^DIRECT_URL=' .env | cut -d= -f2-)
    if [ "$CURRENT_DIRECT_URL" != "$LOCAL_DIRECT_URL" ]; then
        echo "Updating DIRECT_URL in .env"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s#^DIRECT_URL=.*#DIRECT_URL=\"$LOCAL_DIRECT_URL\"#" .env
        else
            sed -i "s#^DIRECT_URL=.*#DIRECT_URL=\"$LOCAL_DIRECT_URL\"#" .env
        fi
    fi
else
    echo "Adding DIRECT_URL to .env"
    echo "DIRECT_URL=\"$LOCAL_DIRECT_URL\"" >> .env
fi

# Check container status
if [ -n "$(docker ps -q -f name="^${DB_CONTAINER_NAME}$")" ]; then
    echo "Database container '$DB_CONTAINER_NAME' already running"
    exit 0
fi

if [ -n "$(docker ps -a -q -f name="^${DB_CONTAINER_NAME}$")" ]; then
    docker start "$DB_CONTAINER_NAME"
    echo "Existing database container '$DB_CONTAINER_NAME' started"
    exit 0
fi

# Warn about default password
if [ "$DB_PASSWORD" = "password" ]; then
    read -p "Default DB password detected. Generate a random one? [y/N]: " -r
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        DB_PASSWORD=$(openssl rand -base64 12 | tr '+/' '-_')
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s#postgresql://$DB_USER:password#postgresql://$DB_USER:$DB_PASSWORD#" .env
        else
            sed -i "s#postgresql://$DB_USER:password#postgresql://$DB_USER:$DB_PASSWORD#" .env
        fi
        echo "Updated password in .env"
    else
        echo "Please change the default password in .env and rerun"
        exit 1
    fi
fi

# Run Postgres container
docker run -d \
--name "$DB_CONTAINER_NAME" \
-e POSTGRES_USER="$DB_USER" \
-e POSTGRES_PASSWORD="$DB_PASSWORD" \
-e POSTGRES_DB="$DB_NAME" \
-p "$DB_PORT":5432 \
postgres

if [ $? -eq 0 ]; then
    echo "Database container '$DB_CONTAINER_NAME' created and running on port $DB_PORT"
else
    echo "Failed to start Postgres container"
    exit 1
fi
