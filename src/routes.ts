import { Router } from "express";

import authMiddleware from "./app/middlewares/authMiddleware";

import AuthController from "./app/controllers/AuthController";
import ScheduleController from "./app/controllers/ScheduleController";
import UserController from "./app/controllers/UserController";

const router = Router();

router.post("/users", UserController.createUser);
router.post("/auth", AuthController.authenticate);

router.get("/users", authMiddleware.staffAuthMiddleware, UserController.index);

router.get(
  "/admin/users",
  authMiddleware.adminAuthMiddleware,
  UserController.getUsers
);

router.put(
  "/admin/users/:id",
  authMiddleware.adminAuthMiddleware,
  UserController.updateUser
);

router.delete(
  "/admin/users/:id",
  authMiddleware.adminAuthMiddleware,
  UserController.deleteUser
);

router.post(
  "/admin/users/:userId/schedules",
  authMiddleware.adminAuthMiddleware,
  ScheduleController.createSchedule
);

router.get(
  "/admin/users/:userId/schedules",
  authMiddleware.adminAuthMiddleware,
  ScheduleController.getUserSchedules
);

router.put(
  "/admin/schedules/:id",
  authMiddleware.adminAuthMiddleware,
  ScheduleController.updateSchedule
);

router.delete(
  "/admin/schedules/:id",
  authMiddleware.adminAuthMiddleware,
  ScheduleController.deleteSchedule
);

export default router;
