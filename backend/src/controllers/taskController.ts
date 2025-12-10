import { Request, Response } from "express";
import { TaskModel } from "../models/Task";
import { ResponseHelper } from "../utils/response";

// Export taskModel so it can be replaced in tests
export const taskModel = new TaskModel();

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await taskModel.findLatestUncompleted(5);
    return ResponseHelper.success(res, tasks, "Tasks retrieved successfully");
  } catch (error: any) {
    console.error("Error getting tasks:", error);
    return ResponseHelper.error(res, error.message || "Internal server error", 500);
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      return ResponseHelper.badRequest(res, "Title is required");
    }

    if (!description || !description.trim()) {
      return ResponseHelper.badRequest(res, "Description is required");
    }

    const task = await taskModel.create({
      title: title.trim(),
      description: description.trim(),
      isCompleted: false,
    });

    return ResponseHelper.success(res, task, "Task created successfully", 201);
  } catch (error: any) {
    console.error("Error creating task:", error);
    return ResponseHelper.error(res, error.message || "Internal server error", 500);
  }
};

export const completeTask = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return ResponseHelper.badRequest(res, "Invalid task id");
    }

    const task = await taskModel.findById(id);
    if (!task) {
      return ResponseHelper.notFound(res, `Task with id ${id} not found`);
    }

    if (task.isCompleted) {
      return ResponseHelper.badRequest(res, `Task with id ${id} is already completed`);
    }

    const updatedTask = await taskModel.update(id, {
      isCompleted: true,
    });

    return ResponseHelper.success(res, updatedTask, "Task completed successfully");
  } catch (error: any) {
    console.error("Error completing task:", error);
    return ResponseHelper.error(res, error.message || "Internal server error", 500);
  }
};

