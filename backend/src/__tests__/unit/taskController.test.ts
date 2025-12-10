import { Request, Response } from "express";
import { getTasks, createTask, completeTask, taskModel } from "../../controllers/taskController";
import { TaskModel } from "../../models/Task";

// Mock the TaskModel
jest.mock("../../models/Task");

describe("Task Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockTaskModelInstance: jest.Mocked<TaskModel>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Create a mock instance
    mockTaskModelInstance = {
      findLatestUncompleted: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    } as any;

    // Replace the exported taskModel with our mock
    (taskModel as any) = mockTaskModelInstance;
  });

  describe("getTasks", () => {
    it("should return tasks", async () => {
      const mockTasks = [
        {
          id: 1,
          title: "Task 1",
          description: "Desc 1",
          isCompleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockTaskModelInstance.findLatestUncompleted.mockResolvedValue(mockTasks);

      await getTasks(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockTasks,
        status: "success",
        message: "Tasks retrieved successfully",
        isError: false,
      });
    });
  });

  describe("createTask", () => {
    it("should create a task with valid data", async () => {
      mockRequest.body = {
        title: "New Task",
        description: "New Description",
      };

      const mockTask = {
        id: 1,
        title: "New Task",
        description: "New Description",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockTaskModelInstance.create.mockResolvedValue(mockTask);

      await createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: mockTask,
        status: "success",
        message: "Task created successfully",
        isError: false,
      });
    });

    it("should return 400 when title is missing", async () => {
      mockRequest.body = {
        description: "New Description",
      };

      await createTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        status: "error",
        message: "Title is required",
        isError: true,
      });
    });
  });

  describe("completeTask", () => {
    it("should complete a task", async () => {
      mockRequest.params = { id: "1" };

      const mockTask = {
        id: 1,
        title: "Task",
        description: "Desc",
        isCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedTask = {
        ...mockTask,
        isCompleted: true,
      };

      mockTaskModelInstance.findById.mockResolvedValue(mockTask);
      mockTaskModelInstance.update.mockResolvedValue(updatedTask);

      await completeTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        data: updatedTask,
        status: "success",
        message: "Task completed successfully",
        isError: false,
      });
    });

    it("should return 404 when task not found", async () => {
      mockRequest.params = { id: "999" };
      mockTaskModelInstance.findById.mockResolvedValue(null);

      await completeTask(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        data: null,
        status: "error",
        message: "Task with id 999 not found",
        isError: true,
      });
    });
  });
});
