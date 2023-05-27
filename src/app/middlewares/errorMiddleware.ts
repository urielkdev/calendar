import { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/errors";

export default (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error);
  res.status(error.statusCode || 500).json({ error: error.message });
};
