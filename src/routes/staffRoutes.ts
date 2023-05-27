import { Router } from "express";

import scheduleController from "../app/controllers/scheduleController";
import userController from "../app/controllers/userController";

const staffRouter = Router();

staffRouter.get("/users", userController.getUsers);

staffRouter.get("/users/me/schedules", scheduleController.getMySchedule);

staffRouter.get(
  "/users/:userId/schedules",
  scheduleController.getUserSchedules
);

export default staffRouter;
