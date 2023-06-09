import User from "../entities/UserEntity";
import Schedule from "../entities/ScheduleEntity";

import { UnprocessableEntityError } from "../../utils/Errors";

import { dbConnection } from "../../database/dbConnection";
import { DeepPartial } from "typeorm";

function getRepository() {
  return dbConnection.getRepository(Schedule);
}

async function getSchedulesByUserId(
  userId: number,
  { startDate, endDate }: { startDate?: string; endDate?: string } = {}
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
    .catch((error) => console.error(error));

  if (!scheduleCreated)
    throw new UnprocessableEntityError("Error creating schedule");

  return scheduleCreated;
}

async function updateSchedule(schedule: DeepPartial<Schedule>) {
  const scheduleRepository = dbConnection.getRepository(Schedule);

  const scheduleSaved = await scheduleRepository
    .save(schedule)
    .catch((error) => console.error(error));

  if (!scheduleSaved)
    throw new UnprocessableEntityError("Error updating schedule");

  return scheduleSaved;
}

async function softDeleteSchedule(schedule: Schedule) {
  const scheduleRepository = dbConnection.getRepository(Schedule);

  const scheduleDeleted = await scheduleRepository
    .softRemove(schedule)
    .catch((error) => console.error(error));

  if (!scheduleDeleted)
    throw new UnprocessableEntityError("Error updating schedule");

  return scheduleDeleted;
}

export default {
  getRepository,
  getSchedulesByUserId,
  createSchedule,
  updateSchedule,
  softDeleteSchedule,
};
