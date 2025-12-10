import { Task } from "../types/task";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface ApiResponse<T> {
  data: T | null;
  status: "success" | "error";
  message: string;
  isError: boolean;
}

export const taskApi = {
  async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const result: ApiResponse<Task[]> = await response.json();
    if (result.isError) {
      throw new Error(result.message);
    }
    return result.data || [];
  },

  async createTask(title: string, description: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    const result: ApiResponse<Task> = await response.json();
    if (result.isError || !result.data) {
      throw new Error(result.message || "Failed to create task");
    }

    return result.data;
  },

  async completeTask(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}/complete`, {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Failed to complete task");
    }

    const result: ApiResponse<Task> = await response.json();
    if (result.isError || !result.data) {
      throw new Error(result.message || "Failed to complete task");
    }

    return result.data;
  },
};
