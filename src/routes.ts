import { Router } from "express";

import authMiddleware from "./app/middlewares/authMiddleware";

import UserController from "./app/controllers/UserController";
import AuthController from "./app/controllers/AuthController";

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

export default router;
