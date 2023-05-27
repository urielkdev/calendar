import { NextFunction, Request, Response } from "express";

import { BadRequestError, NotFoundError } from "../../utils/Errors";
import Schedule from "../entities/ScheduleEntity";

import scheduleService from "../services/scheduleService";
import scheduleView from "../views/scheduleView";
import userService from "../services/userService";

async function getMySchedule(req: Request, res: Response, next: NextFunction) {
  req.params.userId = `${req.userToken.id}`;

  return await getUserSchedules(req, res, next);
}

async function getUserSchedules(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = parseInt(req.params.userId);
  // TODO: validate if endDate > startDate
  // TODO: params validator instead this \/
  const { startDate, endDate } = req.query as {
    startDate: string;
    endDate: string;
  };

  const user = await userService.getRepository().findOneBy({ id: userId });

  if (!user) throw new NotFoundError("User not found");

  const schedules = await scheduleService.getScheduleByUserId(userId, {
    startDate,
    endDate,
  });

  return res.json(scheduleView.renderSchedules(schedules));
}

async function createSchedule(req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.params.userId);
  const { date, shiftHours } = req.body;

  if (!userId || !date || !shiftHours)
    throw new BadRequestError("Missing params");

  const user = await userService.getRepository().findOneBy({ id: userId });

  if (!user) throw new NotFoundError("User not found");
  // TODO: ask if needs to check the conflict dates for insert
  // maybe instead shiftHours, use a endDate

  const schedule = await scheduleService.createSchedule(user, date, shiftHours);

  return res.status(201).json(scheduleView.renderSchedule(schedule));
}

async function updateSchedule(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  const schedule = await scheduleService.getRepository().findOneBy({ id });
  if (!schedule) throw new NotFoundError("Schedule not found");

  // TODO: create a parms validator for body, so it can modify just some data
  const scheduleToUpdate = { ...schedule, ...req.body } as Schedule;

  const scheduleSaved = await scheduleService.updateSchedule(scheduleToUpdate);

  return res.status(200).json(scheduleView.renderSchedule(scheduleSaved));
}

async function deleteSchedule(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

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
