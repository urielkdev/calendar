import { NextFunction, Request, Response } from "express";

// TODO: fix create a pattern to files and names
import dbConnection from "../../database/db-connection";
import Schedule from "../entities/ScheduleEntity";
import ScheduleView from "../views/ScheduleView";
import User from "../entities/UserEntity";
import { BadRequestError, NotFoundError } from "../../utils/errors";

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
  const { startDate, endDate } = req.query;

  const scheduleRepository = dbConnection.getRepository(Schedule);
  const userRepository = dbConnection.getRepository(User);

  const user = await userRepository.findOneBy({ id: userId });

  if (!user) throw new NotFoundError("User not found");

  let query = scheduleRepository
    .createQueryBuilder("schedule")
    .where("schedule.userId = :userId", { userId });

  if (startDate)
    query = query.andWhere("schedule.date >= :startDate", { startDate });

  if (endDate) query = query.andWhere("schedule.date <= :endDate", { endDate });

  const schedules = await query.getMany();
  return res.json(ScheduleView.renderSchedules(schedules));
}

async function createSchedule(req: Request, res: Response, next: NextFunction) {
  const userId = parseInt(req.params.userId);
  const { date, shiftHours } = req.body;

  if (!userId || !date || !shiftHours)
    throw new BadRequestError("Missing params");

  const userRepository = dbConnection.getRepository(User);
  const scheduleRepository = dbConnection.getRepository(Schedule);

  const user = await userRepository.findOneBy({ id: userId });

  if (!user) throw new NotFoundError("User not found");
  // TODO: check if needs to check the conflict dates for insert
  // maybe instead shiftHours, use a endDate

  const schedule = scheduleRepository.create({ date, shiftHours, user });
  const scheduleCreated = await scheduleRepository
    .save(schedule)
    .catch((_err) => null);

  if (!scheduleCreated)
    return res.status(422).json({ message: "Error creating schedule" });

  return res.json(ScheduleView.renderSchedule(scheduleCreated));
}

async function updateSchedule(req: Request, res: Response, next: NextFunction) {
  const scheduleRepository = dbConnection.getRepository(Schedule);
  const id = parseInt(req.params.id);

  const schedule = await scheduleRepository.findOneBy({ id });
  if (!schedule) throw new NotFoundError("Schedule not found");

  // TODO: create a parms validator for body, so it can modify just some data
  const scheduleToUpdate = { ...schedule, ...(req.body as Schedule) };

  const scheduleSaved = await scheduleRepository
    .save(scheduleToUpdate)
    .catch((_err) => null);

  if (!scheduleSaved)
    return res.status(422).json({ message: "Error updating schedule" });

  return res.status(200).json(ScheduleView.renderSchedule(scheduleSaved));
}

async function deleteSchedule(req: Request, res: Response, next: NextFunction) {
  const scheduleRepository = dbConnection.getRepository(Schedule);
  const id = parseInt(req.params.id);

  const schedule = await scheduleRepository.findOneBy({ id });
  if (!schedule) throw new NotFoundError("Schedule not found");

  // TODO: check if id soft delete the schedules cascade
  const scheduleDeleted = await scheduleRepository
    .softRemove(schedule)
    .catch((error) => console.log(error));

  if (!scheduleDeleted)
    return res.status(422).json({ message: "Error updating schedule" });

  return res.status(200).json(ScheduleView.renderSchedule(scheduleDeleted));
}

export default {
  getMySchedule,
  getUserSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
