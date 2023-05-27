import { Router } from "express";

import {
  adminAuthMiddleware,
  staffAuthMiddleware,
} from "../app/middlewares/authMiddleware";
import adminRouter from "./admin-routes";
import openRouter from "./open-routes";
import staffRouter from "./staff-routes";

const router = Router();

router.use("/", openRouter);

router.use("/staff", staffAuthMiddleware, staffRouter);

router.use("/admin", adminAuthMiddleware, adminRouter);

export default router;
