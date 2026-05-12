export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public isOperational: boolean;
  public errors: any[];

  constructor(message: string, statusCode: number, errorCode: string, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BusinessError extends AppError {
  constructor(message: string, errorCode: string = "BUSINESS_RULE_VIOLATION") {
    super(message, 400, errorCode);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors: any[] = []) {
    super(message, 400, "VALIDATION_ERROR", errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized access") {
    super(message, 401, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}
