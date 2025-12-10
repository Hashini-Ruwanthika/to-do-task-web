import mysql from "mysql2/promise";

export interface BaseEntity {
  id: number;
  [key: string]: any;
}

export class BaseModel<T extends BaseEntity> {
  protected tableName: string;
  protected db: mysql.Pool | mysql.Connection;

  constructor(tableName: string, db: mysql.Pool | mysql.Connection) {
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Find a record by ID
   */
  async findById(id: number): Promise<T | null> {
    const [rows] = (await this.db.execute(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    )) as any[];

    if (rows.length === 0) {
      return null;
    }

    return this.mapToEntity(rows[0]);
  }

  /**
   * Find all records matching conditions
   */
  async find(
    conditions: Record<string, any> = {},
    options: {
      orderBy?: string;
      orderDirection?: "ASC" | "DESC";
      limit?: number;
    } = {}
  ): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const values: any[] = [];

    // Build WHERE clause (convert camelCase to snake_case)
    if (Object.keys(conditions).length > 0) {
      const whereClauses = Object.keys(conditions).map((key) => {
        values.push(conditions[key]);
        const dbKey = this.camelToSnake(key);
        return `${dbKey} = ?`;
      });
      query += ` WHERE ${whereClauses.join(" AND ")}`;
    }

    // Add ORDER BY (convert camelCase to snake_case)
    if (options.orderBy) {
      const direction = options.orderDirection || "ASC";
      const dbOrderBy = this.camelToSnake(options.orderBy);
      query += ` ORDER BY ${dbOrderBy} ${direction}`;
    }

    // Add LIMIT (MySQL doesn't support LIMIT with prepared statements)
    if (options.limit) {
      const safeLimit = Math.max(
        1,
        Math.min(1000, parseInt(String(options.limit), 10) || 10)
      );
      query += ` LIMIT ${safeLimit}`;
    }

    // Execute query with parameters
    const [rows] = (await this.db.execute(query, values)) as any[];
    return rows.map((row: any) => this.mapToEntity(row));
  }

  /**
   * Create a new record
   * Converts camelCase fields to snake_case for database
   */
  async create(data: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T> {
    const fields = Object.keys(data);
    // Convert camelCase to snake_case for database columns
    const dbFields = fields.map((field) => this.camelToSnake(field));
    const placeholders = dbFields.map(() => "?").join(", ");
    const values = fields.map((field) => (data as any)[field]);

    const [result] = (await this.db.execute(
      `INSERT INTO ${this.tableName} (${dbFields.join(
        ", "
      )}) VALUES (${placeholders})`,
      values
    )) as any;

    const created = await this.findById(result.insertId);
    if (!created) {
      throw new Error(`Failed to create record in ${this.tableName}`);
    }

    return created;
  }

  /**
   * Update a record by ID
   * Converts camelCase fields to snake_case for database
   */
  async update(
    id: number,
    data: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): Promise<T> {
    const fields = Object.keys(data);
    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    // Convert camelCase to snake_case for database columns
    const dbFields = fields.map((field) => this.camelToSnake(field));
    const setClause = dbFields.map((field) => `${field} = ?`).join(", ");
    const values = fields.map((field) => (data as any)[field]);
    values.push(id);

    await this.db.execute(
      `UPDATE ${this.tableName} SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      values
    );

    const updated = await this.findById(id);
    if (!updated) {
      throw new Error(`Failed to update record in ${this.tableName}`);
    }

    return updated;
  }

  /**
   * Delete a record by ID
   */
  async delete(id: number): Promise<boolean> {
    const [result] = (await this.db.execute(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    )) as any;

    return (result as any).affectedRows > 0;
  }

  /**
   * Check if a record exists by ID
   */
  async exists(id: number): Promise<boolean> {
    const [rows] = (await this.db.execute(
      `SELECT COUNT(*) as count FROM ${this.tableName} WHERE id = ?`,
      [id]
    )) as any[];

    return rows[0].count > 0;
  }

  /**
   * Map database row to entity (override in child classes for custom mapping)
   */
  protected mapToEntity(row: any): T {
    // Default implementation - convert snake_case to camelCase
    const entity: any = {};
    for (const key in row) {
      const camelKey = this.snakeToCamel(key);
      entity[camelKey] = row[key];
    }
    return entity as T;
  }

  /**
   * Convert snake_case to camelCase
   */
  protected snakeToCamel(str: string): string {
    return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  }

  /**
   * Convert camelCase to snake_case
   */
  protected camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
