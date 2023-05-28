import { Request, Response, NextFunction } from "express";

import { ApiError } from "../../utils/Errors";
import { ZodError } from "zod";

export default (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);

  if (error instanceof ZodError) {
    const validationErrors = error.issues.map((issue) => ({
      parameter: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({ errors: [validationErrors] });
  }

  return res.status(error.statusCode || 500).json({ error: error.message });
};
