import { BusinessError } from "../utils/appError";
import { ErrorCodes } from "../utils/errorCodes";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Internal logging. Not sent to frontend.
  console.error("🔥 Error Handling Middleware:", err);

  let statusCode = 500;
  let message = "Internal Server Error. Please try again later.";
  let errorCode = ErrorCodes.INTERNAL_SERVER_ERROR;
  let errors: any[] = [];

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.errorCode;
    errors = err.errors;
  } else {
    // Handling specific common external/library errors
    if (err.name === "ValidationError") {
      statusCode = 400;
      message = "Validation failed";
      errorCode = ErrorCodes.VALIDATION_ERROR;
    } else if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token";
      errorCode = ErrorCodes.TOKEN_INVALID;
    } else if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired";
      errorCode = ErrorCodes.TOKEN_EXPIRED;
    }
    // We intentionally don't expose DB errors (e.g., MySQL or ORM errors)
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    errorCode: errorCode,
    errors: errors,
  });
};
