import { Router } from "express";

import scheduleController from "../app/controllers/scheduleController";
import userController from "../app/controllers/userController";

const staffRouter = Router();

/**
 * @openapi
 * /staff/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Staff routes
 *     responses:
 *       '200':
 *         description: Successful retrieval of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 */
staffRouter.get("/users", userController.getUsers);

/**
 * @openapi
 * /staff/users/me/schedules:
 *   get:
 *     summary: Get schedules for current user
 *     tags:
 *       - Staff routes
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter (optional)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date filter (optional)
 *     responses:
 *       '200':
 *         description: Successful retrieval of current user schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedules:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schedule'
 *       '401':
 *         description: Unauthorized
 */

staffRouter.get("/users/me/schedules", scheduleController.getMySchedule);

/**
 * @openapi
 * /staff/users/{userId}/schedules:
 *   get:
 *     summary: Get schedules for user
 *     tags:
 *       - Staff routes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to retrieve schedules for
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date filter (optional)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date filter (optional)
 *     responses:
 *       '200':
 *         description: Successful retrieval of user schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 schedules:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Schedule'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Schedule not found
 *     securitySchemes:
 *       bearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */
staffRouter.get(
  "/users/:userId/schedules",
  scheduleController.getUserSchedules
);

export default staffRouter;
