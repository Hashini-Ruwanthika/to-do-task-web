import request from "supertest";
import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import taskRoutes from "../../routes/taskRoutes";
import * as taskController from "../../controllers/taskController";
import { TaskModel } from "../../models/Task";

dotenv.config();

describe("Task Routes Integration Tests", () => {
  let app: express.Application;
  let testPool: mysql.Pool;
  let originalTaskModel: TaskModel;

  beforeAll(async () => {
    const testDbConfig = {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "3306", 10),
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "rootpassword",
      database: process.env.TEST_DB_NAME || "todo_test_db",
    };

    try {
      const adminConfig = {
        ...testDbConfig,
        database: undefined,
      };
      const adminConnection = await mysql.createConnection(adminConfig);

      await adminConnection.query(
        `CREATE DATABASE IF NOT EXISTS ${testDbConfig.database}`
      );
      await adminConnection.end();

      testPool = mysql.createPool({
        ...testDbConfig,
        waitForConnections: true,
        connectionLimit: 5,
      });

      const connection = await testPool.getConnection();
      await connection.query(`
        CREATE TABLE IF NOT EXISTS task (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          is_completed BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      connection.release();

      // Replace taskModel with test database instance
      originalTaskModel = taskController.taskModel;
      (taskController as any).taskModel = new TaskModel(testPool);

      app = express();
      app.use(express.json());
      app.use("/api/tasks", taskRoutes);
    } catch (error: any) {
      console.error("Failed to set up test database:", error.message);
      throw error;
    }
  });

  afterAll(async () => {
    // Restore original taskModel
    (taskController as any).taskModel = originalTaskModel;
    if (testPool) {
      await testPool.end();
    }
  });

  beforeEach(async () => {
    if (testPool) {
      const connection = await testPool.getConnection();
      await connection.query("DELETE FROM task");
      connection.release();
    }
  });

  describe("POST /api/tasks", () => {
    it("should create a new task", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          title: "New Task",
          description: "New Description",
        })
        .expect(201);

      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.title).toBe("New Task");
      expect(response.body.data.description).toBe("New Description");
      expect(response.body.data.isCompleted).toBe(false);
      expect(response.body.status).toBe("success");
      expect(response.body.isError).toBe(false);
    });

    it("should return 400 when title is missing", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .send({
          description: "New Description",
        })
        .expect(400);

      expect(response.body.status).toBe("error");
      expect(response.body.isError).toBe(true);
      expect(response.body.message).toBe("Title is required");
    });
  });

  describe("PATCH /api/tasks/:id/complete", () => {
    it("should return 404 when task not found", async () => {
      const response = await request(app)
        .patch("/api/tasks/999/complete")
        .expect(404);

      expect(response.body.status).toBe("error");
      expect(response.body.isError).toBe(true);
    });

    it("should mark task as completed", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .send({
          title: "Task to Complete",
          description: "Description",
        })
        .expect(201);

      const taskId = createResponse.body.data.id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body.data.isCompleted).toBe(true);
      expect(response.body.status).toBe("success");
      expect(response.body.isError).toBe(false);
    });
  });
});
