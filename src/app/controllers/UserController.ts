import { NextFunction, Request, Response } from "express";

import dbConnection from "../../database/db-connection";
import User from "../entities/UserEntity";
import UserView from "../views/UserView";
import { BadRequestError, NotFoundError } from "../../utils/errors";

// TODO: create pagination
async function getUsers(req: Request, res: Response, next: NextFunction) {
  const userRepository = dbConnection.getRepository(User);

  const users = await userRepository.find();

  return res.json(UserView.renderUsers(users));
}

async function getUsersWithAccumulatedShiftLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: validate if endDate > startDate
  const { startDate, endDate } = req.query;

  const userRepository = dbConnection.getRepository(User);

  let query = userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.schedules", "schedule")
    .select([
      "user.id as 'id'",
      "user.name as name",
      "user.email as email",
      "user.role as role",
      "SUM(schedule.shiftHours) as totalHours",
    ])
    .where("schedule.id is not null")
    .groupBy("user.id");

  if (startDate)
    query = query.andWhere("schedule.date >= :startDate", { startDate });

  if (endDate) query = query.andWhere("schedule.date <= :endDate", { endDate });

  const users = await query.getRawMany();

  return res.json(users);
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) throw new BadRequestError("Missing params");

  const userRepository = dbConnection.getRepository(User);
  const userExists = await userRepository.findOne({ where: { email } });

  if (userExists)
    return res.status(409).json({ message: "Email is alreay taken" });

  const user = userRepository.create({ name, email, password });
  const userCreated = await userRepository.save(user).catch((_err) => null);

  if (!userCreated)
    return res.status(422).json({ message: "Error creating user" });

  return res.json(UserView.renderUser(userCreated));
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  const userRepository = dbConnection.getRepository(User);
  const id = parseInt(req.params.id);

  const user = await userRepository.findOneBy({ id });

  if (!user) throw new NotFoundError("User not found");

  // TODO: create a parms validator for body, so it can modify just some data
  const userToUpdate = { ...user, ...(req.body as User) };

  const userSaved = await userRepository
    .save(userToUpdate)
    .catch((_err) => null);

  if (!userSaved)
    return res.status(422).json({ message: "Error updating user" });

  return res.status(200).json(UserView.renderUser(userSaved));
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const userRepository = dbConnection.getRepository(User);
  const id = parseInt(req.params.id);

  const user = await userRepository.findOneBy({ id });

  if (!user) throw new NotFoundError("User not found");

  // TODO: check if id soft delete the schedules cascade
  const userDeleted = await userRepository
    .softRemove(user)
    .catch((error) => console.log(error));

  if (!userDeleted)
    return res.status(422).json({ message: "Error updating user" });

  return res.status(200).json(UserView.renderUser(userDeleted));
}

export default {
  getUsers,
  getUsersWithAccumulatedShiftLength,
  createUser,
  updateUser,
  deleteUser,
};
