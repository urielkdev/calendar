import { NextFunction, Request, Response } from "express";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/Errors";
import User from "../entities/UserEntity";

import userView from "../views/userView";
import userService from "../services/userService";
import utils from "../../utils/utils";

async function getUsers(req: Request, res: Response, next: NextFunction) {
  // TODO: create pagination and some filters, like email, name...
  const users = await userService.getRepository().find();

  return res.json(userView.renderUsers(users));
}

async function getUsersWithAccumulatedShiftLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: validate if endDate > startDate
  const startDate = utils.dateToMySqlFormat(req.query.startDate as string);
  const endDate = utils.dateToMySqlFormat(req.query.endDate as string);

  if (endDate! < startDate!)
    throw new BadRequestError("startDate must be less or equal endDate");

  const users = await userService.getUsersWithAccumulatedShiftLength({
    startDate,
    endDate,
  });

  return res.json(userView.renderUsersWithAccumulatedShiftLength(users));
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  // TODO: create a params validator
  const { body } = req;

  if (!body.name || !body.email || !body.password)
    throw new BadRequestError("Missing params");

  const userToCreate = body as User;

  const userExists = await userService
    .getRepository()
    .findOneBy({ email: userToCreate.email });

  if (userExists) throw new ConflictError("Email is alreay taken");

  const user = await userService.createUser(userToCreate);

  return res.status(201).json(userView.renderUser(user));
}

async function updateUser(req: Request, res: Response, next: NextFunction) {
  const id = parseInt(req.params.id);

  const user = await userService.getRepository().findOneBy({ id });

  if (!user) throw new NotFoundError("User not found");

  // TODO: create a parms validator for body, so it can modify just some data
  // const userToUpdate = { ...user, ...req.body } as User;

  const userSaved = await userService.updateUser(user, req.body);

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
