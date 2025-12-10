# Todo Task Full Stack Application

A full-stack Todo application built with Node.js, Express, React, TypeScript, and MySQL, orchestrated with Docker Compose.

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + Vite + TypeScript
- **Database**: MySQL 8.0
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
.
├── backend/                 # Node.js Backend API
│   ├── src/
│   │   ├── api/            # API routes
│   │   ├── config/         # Configuration (database, swagger)
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models (BaseModel, Task)
│   │   ├── routes/         # Route definitions
│   │   ├── utils/          # Utilities (response helpers)
│   │   └── index.ts        # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── api/            # API service layer
│   │   ├── components/     # React components
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app component
│   │   └── main.tsx        # Entry point
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml      # Docker orchestration
```

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)

### Running with Docker Compose (Recommended)

1. **Clone/Navigate to the project directory**

2. **Start all services:**

   ```bash
   docker-compose up --build
   ```

3. **Access the application:**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/api-docs
   - Health Check: http://localhost:8080/health

4. **Stop all services:**

   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean database):**

   ```bash
   docker-compose down -v
   ```

### Running Locally (Development)

#### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file:

   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=rootpassword
   DB_NAME=todo_db
   PORT=8080
   ```

4. **Start MySQL database:**

   ```bash
   docker-compose up db -d
   ```

5. **Run the backend:**

   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the frontend:**

   ```bash
   npm run dev
   ```

## 📋 Docker Compose Configuration

The `docker-compose.yml` file orchestrates three services:

### 1. Database Service (`db`)

```yaml
db:
  image: mysql:8.0
  container_name: todo-db
  environment:
    MYSQL_ROOT_PASSWORD: rootpassword
    MYSQL_DATABASE: todo_db
    MYSQL_USER: todo
    MYSQL_PASSWORD: todo
  ports:
    - "3306:3306"
  volumes:
    - mysql_data:/var/lib/mysql
  healthcheck:
    test:
      ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "todo", "-ptodo"]
    interval: 10s
    timeout: 5s
    retries: 5
```

**Explanation:**

- Uses MySQL 8.0 image
- Creates database `todo_db` with user `todo`
- Exposes port 3306 for external connections
- Persists data in `mysql_data` volume
- Healthcheck ensures database is ready before other services start

### 2. Backend Service (`backend`)

```yaml
backend:
  build: ./backend
  container_name: todo-backend
  environment:
    DB_HOST: db
    DB_PORT: 3306
    DB_USER: todo
    DB_PASSWORD: todo
    DB_NAME: todo_db
    PORT: 8080
  depends_on:
    db:
      condition: service_healthy
  ports:
    - "8080:8080"
  healthcheck:
    test:
      [
        "CMD",
        "node",
        "-e",
        "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})",
      ]
    interval: 10s
    timeout: 5s
    retries: 5
```

**Explanation:**

- Builds from `./backend` directory
- Connects to database using service name `db` (Docker network DNS)
- Waits for database to be healthy before starting
- Exposes port 8080
- Healthcheck uses Node.js built-in HTTP module to check `/health` endpoint

### 3. Frontend Service (`frontend`)

```yaml
frontend:
  build: ./frontend
  container_name: todo-frontend
  depends_on:
    backend:
      condition: service_healthy
  ports:
    - "3000:80"
```

**Explanation:**

- Builds React app and serves with Nginx
- Waits for backend to be healthy before starting
- Exposes port 3000 (maps to Nginx port 80)
- Nginx proxies `/api` requests to backend service

### Volumes

```yaml
volumes:
  mysql_data:
```

**Explanation:**

- Persistent volume for MySQL data
- Data persists even when containers are removed
- Use `docker-compose down -v` to remove volumes

## 🔧 Available Scripts

### Backend

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📡 API Endpoints

All endpoints return standardized response format:

```json
{
  "data": <response data or null>,
  "status": "success" | "error",
  "message": "Response message",
  "isError": false | true
}
```

### Task Endpoints

- `GET /api/tasks` - Get latest 5 uncompleted tasks
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description"
  }
  ```
- `PATCH /api/tasks/:id/complete` - Mark task as completed

### Health Check

- `GET /health` - Server health status

## ✅ Covered Scenarios & Edge Cases

### Core Features

- ✅ **Create Task**: Users can create tasks with title and description
- ✅ **View Tasks**: UI displays only the latest 5 uncompleted tasks (sorted by creation date, newest first)
- ✅ **Complete Task**: Users can mark tasks as "Done", and completed tasks disappear from the UI

### Validation & Error Handling

- ✅ **Missing Title**: Returns 400 error with message "Title is required"
- ✅ **Missing Description**: Returns 400 error with message "Description is required"
- ✅ **Empty/Whitespace Title**: Trims whitespace and validates (empty after trim = error)
- ✅ **Empty/Whitespace Description**: Trims whitespace and validates (empty after trim = error)
- ✅ **Invalid Task ID**: Returns 400 error for non-numeric IDs
- ✅ **Task Not Found**: Returns 404 error when trying to complete non-existent task
- ✅ **Already Completed**: Returns 400 error when trying to complete an already completed task

### Data Management

- ✅ **Latest 5 Limit**: Backend always returns maximum 5 uncompleted tasks
- ✅ **Auto-filtering**: Completed tasks are automatically excluded from GET requests
- ✅ **Task Ordering**: Tasks are sorted by creation date (newest first)
- ✅ **State Management**: Frontend maintains only 5 tasks in state, refreshes from backend on load

### UI/UX Features

- ✅ **Loading States**: Shows loading indicator while fetching tasks
- ✅ **Error Display**: Shows error messages to users
- ✅ **Empty State**: Displays message when no tasks exist
- ✅ **Form Validation**: Disables submit button when fields are empty
- ✅ **Auto-refresh**: Fetches latest tasks on component mount

## 🗄️ Database Schema

```sql
CREATE TABLE task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

Tests include:

- Unit tests for controllers
- Integration tests for API routes

**Test Coverage:**

- ✅ Task creation with valid data
- ✅ Task creation with missing title
- ✅ Task creation with missing description
- ✅ Getting latest uncompleted tasks
- ✅ Completing a task
- ✅ Completing non-existent task (404)
- ✅ Error handling and response format validation

## 📚 API Documentation

Swagger/OpenAPI documentation is available at:

- http://localhost:8080/api-docs

## 🔍 Troubleshooting

### Database Connection Issues

If backend can't connect to database:

1. Ensure database container is running: `docker-compose ps`
2. Check database health: `docker-compose logs db`
3. Verify environment variables in `docker-compose.yml`

### Port Already in Use

If ports 3000, 8080, or 3306 are already in use:

1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`

### Frontend Can't Reach Backend

1. Check backend is running: `docker-compose logs backend`
2. Verify nginx proxy configuration in `frontend/nginx.conf`
3. Check browser console for CORS errors

## 🛠️ Development Workflow

1. **Make changes to code**
2. **Rebuild containers:**
   ```bash
   docker-compose up --build
   ```
3. **View logs:**
   ```bash
   docker-compose logs -f [service-name]
   ```

## 📝 Environment Variables

### Backend (.env)

```env
DB_HOST=db              # Use 'db' in Docker, 'localhost' locally
DB_PORT=3306
DB_USER=todo
DB_PASSWORD=todo
DB_NAME=todo_db
PORT=8080
```

### Frontend

No environment variables required. API URL defaults to `/api` which is proxied by Vite/Nginx.

## 🚢 Production Deployment

For production:

1. Update environment variables
2. Use production database credentials
3. Configure proper CORS origins
4. Set up SSL/TLS certificates
5. Use environment-specific configurations

## 📄 License

ISC
