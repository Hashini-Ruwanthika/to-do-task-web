# Docker Guide

Complete guide for running the Todo App with Docker and Docker Compose.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## 🚀 Quick Start

### Start All Services

```bash
docker-compose up --build
```

This command will:
- Build Docker images for backend and frontend
- Pull MySQL 8.0 image
- Start all three services (db, backend, frontend)
- Show logs from all services in the terminal

### Start in Background (Detached Mode)

```bash
docker-compose up -d --build
```

Runs containers in the background, freeing up your terminal.

## 🛑 Stopping Services

### Stop All Services

```bash
docker-compose down
```

Stops and removes containers but keeps volumes (database data persists).

### Stop and Remove Everything (Including Database)

```bash
docker-compose down -v
```

**Warning**: This removes all data including the database volume!

## 📊 Managing Containers

### View Running Containers

```bash
docker-compose ps
```

### View Container Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Restart a Specific Service

```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart db
```

### Stop a Specific Service

```bash
docker-compose stop backend
```

### Start a Stopped Service

```bash
docker-compose start backend
```

## 🔧 Rebuilding After Code Changes

### Rebuild and Restart

```bash
docker-compose up --build
```

### Rebuild Specific Service

```bash
docker-compose build backend
docker-compose build frontend
```

Then restart:
```bash
docker-compose up -d
```

## 🗄️ Database Management

### Access MySQL Database

```bash
docker-compose exec db mysql -u todo -ptodo todo_db
```

### View Database Logs

```bash
docker-compose logs db
```

### Backup Database

```bash
docker-compose exec db mysqldump -u todo -ptodo todo_db > backup.sql
```

### Restore Database

```bash
docker-compose exec -T db mysql -u todo -ptodo todo_db < backup.sql
```

## 🐛 Troubleshooting

### Check Service Status

```bash
docker-compose ps
```

All services should show "Up" status.

### View Service Health

```bash
docker-compose ps
```

Check the health status column.

### Restart Everything

```bash
docker-compose down
docker-compose up --build
```

### Clean Build (Remove Images and Rebuild)

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

### Check Port Conflicts

```bash
# Windows PowerShell
netstat -ano | findstr :3000
netstat -ano | findstr :8080
netstat -ano | findstr :3306

# Linux/Mac
lsof -i :3000
lsof -i :8080
lsof -i :3306
```

### Remove All Containers and Volumes

```bash
docker-compose down -v
docker system prune -a
```

**Warning**: This removes everything including images!

## 📁 Docker Compose Services

### Database Service (`db`)

- **Image**: `mysql:8.0`
- **Port**: `3306:3306`
- **Volume**: `mysql_data` (persistent storage)
- **Health Check**: MySQL ping every 10 seconds

### Backend Service (`backend`)

- **Build**: `./backend`
- **Port**: `8080:8080`
- **Depends on**: Database (waits for health check)
- **Health Check**: HTTP GET to `/health` endpoint

### Frontend Service (`frontend`)

- **Build**: `./frontend`
- **Port**: `3000:80` (Nginx serves on port 80)
- **Depends on**: Backend (waits for health check)

## 🔍 Common Commands

### View Container Resource Usage

```bash
docker stats
```

### Execute Command in Running Container

```bash
# Backend container
docker-compose exec backend sh

# Database container
docker-compose exec db bash
```

### Copy Files to/from Container

```bash
# Copy from container
docker cp todo-backend:/app/dist ./local-folder

# Copy to container
docker cp ./local-file todo-backend:/app/
```

## 🌐 Access Points

Once containers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger Docs**: http://localhost:8080/api-docs
- **Health Check**: http://localhost:8080/health
- **MySQL**: localhost:3306

## 📝 Environment Variables

Environment variables are set in `docker-compose.yml`:

```yaml
DB_HOST=db              # Service name (Docker DNS)
DB_PORT=3306
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo_db
PORT=8080
```

To override, create a `.env` file or modify `docker-compose.yml`.

## 🔄 Development Workflow

1. **Make code changes**
2. **Rebuild affected service:**
   ```bash
   docker-compose build backend
   ```
3. **Restart service:**
   ```bash
   docker-compose up -d backend
   ```
4. **Or rebuild everything:**
   ```bash
   docker-compose up --build
   ```

## 💾 Data Persistence

Database data is stored in a Docker volume `mysql_data`. This means:

- ✅ Data persists when containers are stopped
- ✅ Data persists when containers are removed
- ❌ Data is lost when volume is removed (`docker-compose down -v`)

## 🚨 Important Notes

1. **First Run**: Initial startup may take 2-3 minutes as images are built
2. **Database**: Wait for database health check before backend starts
3. **Ports**: Ensure ports 3000, 8080, and 3306 are not in use
4. **Volumes**: Database volume persists data between container restarts
5. **Networking**: Services communicate via Docker network using service names

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)


