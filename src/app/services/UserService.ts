import User from "../entities/UserEntity";

import { UnprocessableEntityError } from "../../utils/Errors";

import dbConnection from "../../database/dbConnection";

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

async function createUser(user: User): Promise<User> {
  const userRepository = dbConnection.getRepository(User);

  const userToCreate = userRepository.create(user);
  const userCreated = await userRepository
    .save(userToCreate)
    .catch((_err) => null);

  if (!userCreated) throw new UnprocessableEntityError("Error creating user");

  return userCreated;
}

async function updateUser(user: User): Promise<User> {
  const userRepository = dbConnection.getRepository(User);

  const userUpdated = await userRepository.save(user).catch((_err) => null);

  if (!userUpdated) throw new UnprocessableEntityError("Error updating user");

  return userUpdated;
}

async function softDeleteUser(user: User): Promise<User> {
  const userRepository = dbConnection.getRepository(User);

  const userDeleted = await userRepository
    .softRemove(user)
    .catch((_err) => null);

  if (!userDeleted) throw new UnprocessableEntityError("Error updating user");

  return userDeleted;
}

export default {
  getRepository,
  getUsersWithAccumulatedShiftLength,
  createUser,
  updateUser,
  softDeleteUser,
};
