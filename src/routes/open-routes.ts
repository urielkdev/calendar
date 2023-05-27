import { Router } from "express";

import AuthController from "../app/controllers/AuthController";
import UserController from "../app/controllers/UserController";

const openRouter = Router();

openRouter.post("/users", UserController.createUser);
openRouter.post("/auth", AuthController.authenticate);

export default openRouter;
