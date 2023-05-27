import { NextFunction, Request, Response } from "express";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/Errors";
import User from "../entities/UserEntity";

import userView from "../views/userView";
import userService from "../services/userService";

// TODO: create pagination
async function getUsers(req: Request, res: Response, next: NextFunction) {
  const users = await userService.getRepository().find();

  return res.json(userView.renderUsers(users));
}

async function getUsersWithAccumulatedShiftLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: validate if endDate > startDate
  const { startDate, endDate } = req.query as {
    startDate: string;
    endDate: string;
  };

  const users = await userService.getUsersWithAccumulatedShiftLength({
    startDate,
    endDate,
  });

  return res.json(users);
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  // TODO: create a params validator
  const { body } = req;

  if (!body.name || !body.email || !body.password)
    throw new BadRequestError("Missing params");

  const userToCreate = body as User;

  const userExists = await userService
    .getRepository()
    .findOne({ where: { email: userToCreate.email } });

  if (userExists) throw new ConflictError("Email is alreay taken");

  const user = await userService.createUser(userToCreate);

  return res.json(userView.renderUser(user));
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  const user = await userService.getRepository().findOneBy({ id });

  if (!user) throw new NotFoundError("User not found");

  // TODO: create a parms validator for body, so it can modify just some data
  const userToUpdate = { ...user, ...req.body } as User;

  const userSaved = await userService.updateUser(userToUpdate);

  return res.status(200).json(userView.renderUser(userSaved));
}

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  const user = await userService.getRepository().findOneBy({ id });

  if (!user) throw new NotFoundError("User not found");

  // TODO: check if id soft delete the schedules cascade
  const userDeleted = await userService.softDeleteUser(user);

  return res.status(200).json(userView.renderUser(userDeleted));
}

export default {
  getUsers,
  getUsersWithAccumulatedShiftLength,
  createUser,
  updateUser,
  deleteUser,
};
