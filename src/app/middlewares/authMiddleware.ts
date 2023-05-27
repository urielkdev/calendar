import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  id: number;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

function auth(headers: any, role: string) {
  const { authorization } = headers;

  if (!authorization) throw new Error("Unauthorized");
  const token = authorization.replace("Bearer", "").trim();
  const data = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as TokenPayload;

  if (data.role !== role) throw new Error("Unauthorized");

  return data;
}

export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = auth(req.headers, "admin");

    req.userToken = data;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function staffAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = auth(req.headers, "staff");

    req.userToken = data;
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
