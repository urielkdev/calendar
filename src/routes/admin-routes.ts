import { Router } from "express";

import ScheduleController from "../app/controllers/ScheduleController";
import UserController from "../app/controllers/UserController";

const adminRouter = Router();

adminRouter.get("/users", UserController.getUsers);

adminRouter.get(
  "/users/report",
  UserController.getUsersWithAccumulatedShiftLength
);

adminRouter.put("/users/:id", UserController.updateUser);

adminRouter.delete("/users/:id", UserController.deleteUser);

adminRouter.post("/users/:userId/schedules", ScheduleController.createSchedule);

adminRouter.get(
  "/users/:userId/schedules",
  ScheduleController.getUserSchedules
);

adminRouter.put("/schedules/:id", ScheduleController.updateSchedule);

adminRouter.delete("/schedules/:id", ScheduleController.deleteSchedule);

export default adminRouter;
