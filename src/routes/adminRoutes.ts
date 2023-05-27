import { Router } from "express";

import scheduleController from "../app/controllers/scheduleController";
import userController from "../app/controllers/userController";

const adminRouter = Router();
// TODO: put an authentication to this openapi routes

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Admin routes
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
adminRouter.get("/users", userController.getUsers);

/**
 * @openapi
 * /admin/users/reports:
 *   get:
 *     summary: Get users reports
 *     tags:
 *       - Admin routes
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
 *         description: Successful retrieval of users reports
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       totalHours:
 *                         type: number
 *                         format: float
 *       '401':
 *         description: Unauthorized
 */
adminRouter.get(
  "/users/reports",
  userController.getUsersWithAccumulatedShiftLength
);

/**
 * @openapi
 * /admin/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags:
 *       - Admin routes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum:
 *                   - 'staff'
 *                   - 'admin'
 *               password:
 *                 type: string
 *             example:
 *               name: Ronald
 *               role: staff
 *               password: newPass
 *     responses:
 *       '200':
 *         description: Successful update of user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */
adminRouter.put("/users/:id", userController.updateUser);

/**
 * @openapi
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags:
 *       - Admin routes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to delete
 *     responses:
 *       '204':
 *         description: User successfully deleted
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '422':
 *         description: Error deleting schedules of delete user | Error deleting user
 */
adminRouter.delete("/users/:id", userController.deleteUser);

/**
 * @openapi
 * /admin/users/{userId}/schedules:
 *   post:
 *     summary: Create schedule for user (admin only)
 *     tags:
 *       - Admin routes
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the user to create a schedule for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               shiftHours:
 *                 type: float
 *             example:
 *               date: 2023-05-30 21:07:46
 *               shiftHours: 5.5
 *     responses:
 *       '200':
 *         description: Successful creation of schedule for a user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 */
adminRouter.post("/users/:userId/schedules", scheduleController.createSchedule);

/**
 * @openapi
 * /admin/users/{userId}/schedules:
 *   get:
 *     summary: Get schedules for user
 *     tags:
 *       - Admin routes
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
 */
adminRouter.get(
  "/users/:userId/schedules",
  scheduleController.getUserSchedules
);

/**
 * @openapi
 * /admin/schedules/{id}:
 *   put:
 *     summary: Update schedule by ID
 *     tags:
 *       - Admin routes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the schedule to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               shiftHours:
 *                 type: float
 *             example:
 *               date: 2023-05-28 21:07:46
 *               shiftHours: 4.2
 *     responses:
 *       '200':
 *         description: Successful update of schedule
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Schedule'
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Schedule not found
 */
adminRouter.put("/schedules/:id", scheduleController.updateSchedule);

/**
 * @openapi
 * /admin/schedules/{id}:
 *   delete:
 *     summary: Delete schedule by ID
 *     tags:
 *       - Admin routes
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the schedule to delete
 *     responses:
 *       '204':
 *         description: Schedule successfully deleted
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Schedule not found
 *       '422':
 *         description: Error deleting schedule
 */
adminRouter.delete("/schedules/:id", scheduleController.deleteSchedule);

export default adminRouter;
