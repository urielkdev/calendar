import { NextFunction, Request, Response, Router } from "express";

import authController from "../app/controllers/authController";
import userController from "../app/controllers/userController";

const openRouter = Router();

openRouter.get("/health", (req: Request, res: Response, next: NextFunction) =>
  res.send({ ok: true })
);

openRouter.post("/users", userController.createUser);
openRouter.post("/auth", authController.login);

export default openRouter;
