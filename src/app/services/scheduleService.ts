import User from "../entities/UserEntity";
import Schedule from "../entities/ScheduleEntity";

import { UnprocessableEntityError } from "../../utils/Errors";

import dbConnection from "../../database/dbConnection";

function getRepository() {
  return dbConnection.getRepository(Schedule);
}

async function getScheduleByUserId(
  userId: number,
  { startDate, endDate }: { startDate?: string; endDate?: string }
) {
  const scheduleRepository = dbConnection.getRepository(Schedule);

  let query = scheduleRepository
    .createQueryBuilder("schedule")
    .where("schedule.userId = :userId", { userId });

  if (startDate)
    query = query.andWhere("schedule.date >= :startDate", { startDate });

  if (endDate) query = query.andWhere("schedule.date <= :endDate", { endDate });

  return await query.getMany();
}

async function createSchedule(user: User, date: string, shiftHours: number) {
  const scheduleRepository = dbConnection.getRepository(Schedule);

  const schedule = scheduleRepository.create({ date, shiftHours, user });
  const scheduleCreated = await scheduleRepository
    .save(schedule)
    .catch((_err) => null);

  if (!scheduleCreated)
    throw new UnprocessableEntityError("Error creating schedule");

  return scheduleCreated;
}

async function updateSchedule(schedule: Schedule) {
  const scheduleRepository = dbConnection.getRepository(Schedule);

  const scheduleSaved = await scheduleRepository
    .save(schedule)
    .catch((_err) => null);

  if (!scheduleSaved)
    throw new UnprocessableEntityError("Error updating schedule");

  return scheduleSaved;
}

async function softDeleteSchedule(schedule: Schedule) {
  const scheduleRepository = dbConnection.getRepository(Schedule);

  const scheduleDeleted = await scheduleRepository
    .softRemove(schedule)
    .catch((_err) => null);

  if (!scheduleDeleted)
    throw new UnprocessableEntityError("Error updating schedule");

  return scheduleDeleted;
}

export default {
  getRepository,
  getScheduleByUserId,
  createSchedule,
  updateSchedule,
  softDeleteSchedule,
};
