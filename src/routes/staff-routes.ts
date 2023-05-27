import { Router } from "express";

import ScheduleController from "../app/controllers/ScheduleController";
import UserController from "../app/controllers/UserController";

const staffRouter = Router();

staffRouter.get("/users", UserController.getUsers);

staffRouter.get("/users/me/schedules", ScheduleController.getMySchedule);

staffRouter.get(
  "/users/:userId/schedules",
  ScheduleController.getUserSchedules
);

export default staffRouter;
