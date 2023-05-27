import { Router } from "express";

import {
  adminAuthMiddleware,
  staffAuthMiddleware,
} from "../app/middlewares/authMiddleware";
import adminRouter from "./adminRoutes";
import openRouter from "./openRoutes";
import staffRouter from "./staffRoutes";

const router = Router();

router.use("/", openRouter);

router.use("/staff", staffAuthMiddleware, staffRouter);

router.use("/admin", adminAuthMiddleware, adminRouter);

export default router;
