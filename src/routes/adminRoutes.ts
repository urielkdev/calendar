import { Router } from "express";

import scheduleController from "../app/controllers/scheduleController";
import userController from "../app/controllers/userController";

const adminRouter = Router();

adminRouter.get("/users", userController.getUsers);

adminRouter.get(
  "/users/report",
  userController.getUsersWithAccumulatedShiftLength
);

adminRouter.put("/users/:id", userController.updateUser);

adminRouter.delete("/users/:id", userController.deleteUser);

adminRouter.post("/users/:userId/schedules", scheduleController.createSchedule);

adminRouter.get(
  "/users/:userId/schedules",
  scheduleController.getUserSchedules
);

adminRouter.put("/schedules/:id", scheduleController.updateSchedule);

adminRouter.delete("/schedules/:id", scheduleController.deleteSchedule);

export default adminRouter;
