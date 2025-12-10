import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Todo App API",
      version: "1.0.0",
      description: "API documentation for Todo Task Management Application",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Tasks",
        description: "Task management endpoints",
      },
    ],
    components: {
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            data: {
              description: "Response data (can be object, array, or null)",
              oneOf: [
                { $ref: "#/components/schemas/Task" },
                { type: "array", items: { $ref: "#/components/schemas/Task" } },
                { type: "null" },
              ],
            },
            status: {
              type: "string",
              enum: ["success", "error"],
              description: "Response status",
              example: "success",
            },
            message: {
              type: "string",
              description: "Response message",
              example: "Tasks retrieved successfully",
            },
            isError: {
              type: "boolean",
              description: "Whether the response is an error",
              example: false,
            },
          },
          required: ["data", "status", "message", "isError"],
        },
        Task: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              description: "Task ID",
              example: 1,
            },
            title: {
              type: "string",
              description: "Task title",
              example: "Buy groceries",
            },
            description: {
              type: "string",
              description: "Task description",
              example: "Buy milk, bread, and eggs",
            },
            isCompleted: {
              type: "boolean",
              description: "Task completion status",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Task creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Task last update timestamp",
            },
          },
          required: [
            "id",
            "title",
            "description",
            "isCompleted",
            "createdAt",
            "updatedAt",
          ],
        },
        CreateTaskRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Task title",
              example: "Buy groceries",
            },
            description: {
              type: "string",
              description: "Task description",
              example: "Buy milk, bread, and eggs",
            },
          },
          required: ["title", "description"],
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
