import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../../utils/Errors";

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

  if (!authorization) throw new UnauthorizedError();

  const token = authorization.replace("Bearer", "").trim();
  const data = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as TokenPayload;

  if (data.role !== role) throw new UnauthorizedError();

  return data;
}

export function adminAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const data = auth(req.headers, "admin");

  req.userToken = data;
  next();
}

export function staffAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("adsakpdoaspod");
  const data = auth(req.headers, "staff");

  req.userToken = data;
  next();
}
