export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string = "Internal Server Error",
    statusCode: number = 500
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class UnprocessableEntityError extends ApiError {
  constructor(message: string = "Unprocessable Entity") {
    super(message, 422);
  }
}
