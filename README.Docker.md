# Docker Deployment Guide

## Prerequisites

- Docker installed (https://docs.docker.com/get-docker/)
- Docker Compose installed (https://docs.docker.com/compose/install/)

## Quick Start

### 1. Setup Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file with your actual values:
- Database credentials
- Mail server configuration
- API keys

### 2. Build and Start Containers

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:3306

### 4. Stop Containers

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes the database)
docker-compose down -v
```

## Development Mode

For development with hot-reload:

```bash
# Start only the database
docker-compose up -d db

# Run server locally
cd Server
npm install
npm start

# Run UI locally (in another terminal)
cd UI
npm install
npm start
```

## Production Deployment

### GitHub Container Registry

This project is configured to automatically build and push Docker images to GitHub Container Registry on push to main branch.

#### Pull Images from GitHub

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull images
docker pull ghcr.io/YOUR_USERNAME/braincheck_the_legeaned_team-server:latest
docker pull ghcr.io/YOUR_USERNAME/braincheck_the_legeaned_team-ui:latest
```

#### Using Pre-built Images

Create a `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    # ... (same as docker-compose.yml)

  server:
    image: ghcr.io/YOUR_USERNAME/braincheck_the_legeaned_team-server:latest
    # ... (rest of config)

  ui:
    image: ghcr.io/YOUR_USERNAME/braincheck_the_legeaned_team-ui:latest
    # ... (rest of config)
```

Then deploy:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Database Management

### Initialize Database

Place SQL initialization scripts in `Server/init-db/` directory. They will be automatically executed when the database container starts for the first time.

### Backup Database

```bash
docker-compose exec db mysqldump -u root -p braincheck > backup.sql
```

### Restore Database

```bash
docker-compose exec -T db mysql -u root -p braincheck < backup.sql
```

## Troubleshooting

### Container won't start

```bash
# Check container logs
docker-compose logs

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

### Database connection issues

```bash
# Check if database is healthy
docker-compose ps

# Test database connection
docker-compose exec server nc -zv db 3306
```

### Clear everything and restart

```bash
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

## Useful Commands

```bash
# View running containers
docker-compose ps

# Execute command in container
docker-compose exec server sh

# View resource usage
docker stats

# Rebuild specific service
docker-compose build server
docker-compose up -d server
```
