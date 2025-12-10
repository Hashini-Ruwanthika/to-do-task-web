import { Response } from "express";

export interface ApiResponse<T = any> {
  data: T | null;
  status: "success" | "error";
  message: string;
  isError: boolean;
}

export class ResponseHelper {
  static success<T>(
    res: Response,
    data: T,
    message: string = "Success",
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      data,
      status: "success",
      message,
      isError: false,
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string = "Internal server error",
    statusCode: number = 500,
    data: any = null
  ): Response {
    const response: ApiResponse = {
      data,
      status: "error",
      message,
      isError: true,
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(
    res: Response,
    message: string = "Bad request",
    data: any = null
  ): Response {
    return this.error(res, message, 400, data);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found",
    data: any = null
  ): Response {
    return this.error(res, message, 404, data);
  }
}

