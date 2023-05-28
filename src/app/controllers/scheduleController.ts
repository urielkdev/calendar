import { NextFunction, Request, Response } from "express";

import { BadRequestError, NotFoundError } from "../../utils/Errors";

import scheduleService from "../services/scheduleService";
import scheduleView from "../views/scheduleView";
import userService from "../services/userService";
import utils from "../../utils/utils";
import { z } from "zod";

async function getMySchedule(req: Request, res: Response, next: NextFunction) {
  req.params.userId = `${req.userToken.id}`;

  return await getUserSchedules(req, res, next);
}

// TODO: use datetime pattern to start and end date
const getUserSchedulesSchema = z.object({
  userId: z.number(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

async function getUserSchedules(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId, ...restParams } = getUserSchedulesSchema.parse({
    userId: parseInt(req.params.userId),
    ...req.query,
  });
  const startDate = utils.dateToMySqlFormat(restParams.startDate);
  const endDate = utils.dateToMySqlFormat(restParams.endDate);

  if (endDate! < startDate!)
    throw new BadRequestError("startDate must be less or equal endDate");

  const user = await userService.getRepository().findOneBy({ id: userId });

  if (!user) throw new NotFoundError("User not found");

  const schedules = await scheduleService.getSchedulesByUserId(userId, {
    startDate,
    endDate,
  });

  return res.json(scheduleView.renderSchedules(schedules));
}

const createScheduleSchema = z.object({
  userId: z.number().int(),
  date: z.string(),
  shiftHours: z.number(),
});

async function createSchedule(req: Request, res: Response, next: NextFunction) {
  const { userId, date, shiftHours } = createScheduleSchema.parse({
    userId: parseInt(req.params.userId),
    ...req.body,
  });

  if (!userId || !date || !shiftHours)
    throw new BadRequestError("Missing params");
  const user = await userService.getRepository().findOneBy({ id: userId });

  if (!user) throw new NotFoundError("User not found");

  // TODO: ask if needs to check the conflict dates for insert
  // maybe instead shiftHours, use a endDate
  const schedule = await scheduleService.createSchedule(user, date, shiftHours);

  return res.status(201).json(scheduleView.renderSchedule(schedule));
}

const updateScheduleSchema = z.object({
  id: z.number().int(),
  date: z.string().optional(),
  shiftHours: z.number().optional(),
});

async function updateSchedule(req: Request, res: Response, next: NextFunction) {
  const { id, ...restBody } = updateScheduleSchema.parse({
    id: parseInt(req.params.id),
    ...req.body,
  });

  const schedule = await scheduleService.getRepository().findOneBy({ id });

  if (!schedule) throw new NotFoundError("Schedule not found");

  // TODO: create a parms validator for body, so it can modify just some data
  const scheduleToUpdate = { ...schedule, ...restBody };

  const scheduleSaved = await scheduleService.updateSchedule(scheduleToUpdate);

  return res.status(200).json(scheduleView.renderSchedule(scheduleSaved));
}

const deleteScheduleSchema = z.object({
  id: z.number().int(),
});

async function deleteSchedule(req: Request, res: Response, next: NextFunction) {
  const { id } = deleteScheduleSchema.parse({
    id: parseInt(req.params.id),
  });

  const schedule = await scheduleService.getRepository().findOneBy({ id });

  if (!schedule) throw new NotFoundError("Schedule not found");

  // TODO: check if id soft delete the schedules cascade
  const scheduleDeleted = await scheduleService.softDeleteSchedule(schedule);

  return res.status(200).json(scheduleView.renderSchedule(scheduleDeleted));
}

export default {
  getMySchedule,
  getUserSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
