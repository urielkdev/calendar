import User from "../entities/UserEntity";

import { UnprocessableEntityError } from "../../utils/Errors";

import { dbConnection } from "../../database/dbConnection";
import scheduleService from "./scheduleService";
import { DeepPartial } from "typeorm";

function getRepository() {
  return dbConnection.getRepository(User);
}

// TODO: put a order by in some queries
async function getUsersWithAccumulatedShiftLength({
  startDate,
  endDate,
}: {
  startDate?: string;
  endDate?: string;
}) {
  const userRepository = dbConnection.getRepository(User);

  let query = userRepository
    .createQueryBuilder("user")
    .innerJoinAndSelect("user.schedules", "schedule")
    .select([
      "user.id as 'id'",
      "user.name as name",
      "user.email as email",
      "user.role as role",
      "SUM(schedule.shiftHours) as totalHours",
    ])
    .groupBy("user.id");

  if (startDate)
    query = query.andWhere("schedule.date >= :startDate", { startDate });

  if (endDate) query = query.andWhere("schedule.date <= :endDate", { endDate });

  return await query.getRawMany();
}

async function createUser(user: DeepPartial<User>): Promise<User> {
  const userRepository = dbConnection.getRepository(User);

  const userToCreate = userRepository.create(user);
  const userCreated = await userRepository
    .save(userToCreate)
    .catch((error) => console.error(error));

  if (!userCreated) throw new UnprocessableEntityError("Error creating user");

  return userCreated;
}

async function updateUser(
  user: User,
  changes: DeepPartial<User>
): Promise<User> {
  const userRepository = dbConnection.getRepository(User);

  const userRecreated = userRepository.create({ ...user, ...changes });
  const userUpdated = await userRepository
    .save(userRecreated)
    .catch((error) => console.error(error));

  if (!userUpdated) throw new UnprocessableEntityError("Error updating user");

  return userUpdated;
}

async function softDeleteUser(user: User): Promise<User> {
  const userRepository = dbConnection.getRepository(User);

  const schedules = await scheduleService.getSchedulesByUserId(user.id);
  const schedulesDeleted = await scheduleService
    .getRepository()
    .softRemove(schedules)
    .catch((error) => console.error(error));

  if (!schedulesDeleted)
    throw new UnprocessableEntityError(
      "Error deleting schedules in delete user"
    );

  const userDeleted = await userRepository
    .softRemove(user)
    .catch((error) => console.error(error));

  if (!userDeleted) throw new UnprocessableEntityError("Error deleting user");

  return userDeleted;
}

export default {
  getRepository,
  getUsersWithAccumulatedShiftLength,
  createUser,
  updateUser,
  softDeleteUser,
};
