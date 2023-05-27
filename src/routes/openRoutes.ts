import { Router } from "express";

import authController from "../app/controllers/authController";
import userController from "../app/controllers/userController";

const openRouter = Router();

openRouter.post("/users", userController.createUser);
openRouter.post("/auth", authController.authenticate);

export default openRouter;
