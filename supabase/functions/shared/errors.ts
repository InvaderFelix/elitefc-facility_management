export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function badRequest(message: string, code?: string): AppError {
  return new AppError(400, message, code);
}

export function unauthorized(message = "Unauthorized"): AppError {
  return new AppError(401, message);
}

export function forbidden(message = "Forbidden"): AppError {
  return new AppError(403, message);
}

export function notFound(message = "Not found"): AppError {
  return new AppError(404, message);
}

export function conflict(message: string, code?: string): AppError {
  return new AppError(409, message, code);
}

export function internal(message = "Internal server error"): AppError {
  return new AppError(500, message);
}
