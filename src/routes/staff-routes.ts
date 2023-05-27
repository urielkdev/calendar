import { Router } from "express";

import ScheduleController from "../app/controllers/ScheduleController";

const staffRouter = Router();

staffRouter.get("/users/me/schedules", ScheduleController.getMySchedule);

staffRouter.get(
  "/users/:userId/schedules",
  ScheduleController.getUserSchedules
);

export default staffRouter;
