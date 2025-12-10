import { pool } from "../config/database";
import { BaseModel } from "./BaseModel";

export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class TaskModel extends BaseModel<Task> {
  constructor(db: any = pool) {
    super("task", db);
  }

  /**
   * Find latest uncompleted tasks
   */
  async findLatestUncompleted(count: number): Promise<Task[]> {
    return this.find(
      { isCompleted: false }, // Use camelCase - will be converted to snake_case
      {
        orderBy: "createdAt", // Use camelCase - will be converted to snake_case
        orderDirection: "DESC",
        limit: count,
      }
    );
  }

  /**
   * Override mapToEntity to handle boolean conversion and date parsing
   */
  protected mapToEntity(row: any): Task {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      isCompleted: Boolean(row.is_completed),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }
}
