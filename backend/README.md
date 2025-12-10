# Todo App Backend

Node.js + Express + TypeScript backend with MySQL.

## Prerequisites

- Node.js 18+
- MySQL 8.0+ (or use Docker)

## Setup Options

### Option 1: Using Docker (Recommended)

1. Start MySQL with Docker:
```bash
docker run --name todo-mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=todo_db -e MYSQL_USER=todo -e MYSQL_PASSWORD=todo -p 3306:3306 -d mysql:8.0
```

2. Create `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo_db
PORT=8080
```

3. Install dependencies and run:
```bash
npm install
npm run dev
```

### Option 2: Local MySQL Setup

1. Install MySQL locally and start the service

2. Create database and user:
```sql
CREATE DATABASE todo_db;
CREATE USER 'todo'@'localhost' IDENTIFIED BY 'todo';
GRANT ALL PRIVILEGES ON todo_db.* TO 'todo'@'localhost';
FLUSH PRIVILEGES;
```

3. Create `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo_db
PORT=8080
```

4. Install dependencies and run:
```bash
npm install
npm run dev
```

## Development

```bash
# Install dependencies
npm install

# Run in development mode (with nodemon)
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test
```

## Environment Variables

Create a `.env` file in the backend directory with:

- `DB_HOST` - MySQL host (default: localhost)
- `DB_PORT` - MySQL port (default: 3306)
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - Database name (default: todo_db)
- `PORT` - Server port (default: 8080)

## API Endpoints

- `GET /api/tasks` - Get latest 5 uncompleted tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id/complete` - Mark task as completed
- `GET /health` - Health check

