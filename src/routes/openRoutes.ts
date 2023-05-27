import { NextFunction, Request, Response, Router } from "express";

import authController from "../app/controllers/authController";
import userController from "../app/controllers/userController";

const openRouter = Router();
/**
 * @openapi
 * /health:
 *   get:
 *     summary: Responds if the app is up and running
 *     tags:
 *       - Healthcheck
 *     responses:
 *       '200':
 *         description: App is up and running
 */
openRouter.get("/health", (req: Request, res: Response, next: NextFunction) =>
  res.send({ ok: true })
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Public route
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               name: John Doe
 *               email: john@example.com
 *               password: password123
 *     responses:
 *       '201':
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '409':
 *         description: Email is alreay taken
 */
openRouter.post("/users", userController.createUser);

/**
 * @openapi
 * /auth:
 *   post:
 *     tags:
 *       - Public route
 *     summary: Authenticate user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       '401':
 *         description: Unauthorized
 */
openRouter.post("/auth", authController.login);

export default openRouter;
