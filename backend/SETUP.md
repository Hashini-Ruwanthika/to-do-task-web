# Quick Setup Guide

## MySQL Connection Error Fix

You're getting a MySQL connection error because MySQL isn't running locally. Here are your options:

### Option 1: Start MySQL with Docker (Easiest)

1. **Start Docker Desktop** (if you have it installed)

2. **Run MySQL container:**
```bash
docker run --name todo-mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=todo_db -e MYSQL_USER=todo -e MYSQL_PASSWORD=todo -p 3306:3306 -d mysql:8.0
```

3. **Create `.env` file** in the `backend` folder:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo_db
PORT=8080
```

4. **Run the backend:**
```bash
npm run dev
```

### Option 2: Use Local MySQL

1. **Install MySQL** locally and start the service

2. **Create database and user:**
```sql
CREATE DATABASE todo_db;
CREATE USER 'todo'@'localhost' IDENTIFIED BY 'todo';
GRANT ALL PRIVILEGES ON todo_db.* TO 'todo'@'localhost';
FLUSH PRIVILEGES;
```

3. **Create `.env` file** in the `backend` folder:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo_db
PORT=8080
```

4. **Run the backend:**
```bash
npm run dev
```

### Option 3: Use Docker Compose (Full Stack)

From the root directory (`C:\New folder`):

```bash
docker-compose up --build
```

This will start MySQL, backend, and frontend all together.

---

## Creating the .env File

**Windows PowerShell:**
```powershell
cd backend
@"
DB_HOST=localhost
DB_PORT=3306
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo_db
PORT=8080
"@ | Out-File -FilePath .env -Encoding utf8
```

**Or manually create** `backend/.env` file with the content above.

