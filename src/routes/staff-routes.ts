import { Router } from "express";

import ScheduleController from "../app/controllers/ScheduleController";
import UserController from "../app/controllers/UserController";

const staffRouter = Router();

staffRouter.get("/users", UserController.index);

export default staffRouter;
