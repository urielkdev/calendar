import { NextFunction, Request, Response } from "express";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../../utils/Errors";
import User from "../entities/UserEntity";

import userView from "../views/UserView";
import userService from "../services/userService";
import utils from "../../utils/utils";
import { z } from "zod";

async function getUsers(req: Request, res: Response, next: NextFunction) {
  // TODO: create pagination and some filters, like email, name...
  const users = await userService.getRepository().find();

  return res.json(userView.renderUsers(users));
}

const getUsersWithAccumulatedShiftLengthSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

async function getUsersWithAccumulatedShiftLength(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // TODO: validate if endDate > startDate
  const params = getUsersWithAccumulatedShiftLengthSchema.parse(req.query);
  const startDate = utils.dateToMySqlFormat(params.startDate as string);
  const endDate = utils.dateToMySqlFormat(params.endDate as string);

  if (endDate! < startDate!)
    throw new BadRequestError("startDate must be less or equal endDate");

  const users = await userService.getUsersWithAccumulatedShiftLength({
    startDate,
    endDate,
  });

  return res.json(userView.renderUsersWithAccumulatedShiftLength(users));
}

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

async function createUser(req: Request, res: Response, next: NextFunction) {
  const params = createUserSchema.parse(req.body);

  const userToCreate = params;

  const userExists = await userService
    .getRepository()
    .findOneBy({ email: userToCreate.email });

  if (userExists) throw new ConflictError("Email is alreay taken");

  const user = await userService.createUser(userToCreate);

  return res.status(201).json(userView.renderUser(user));
}

const updateUserSchema = z.object({
  id: z.number().int(),
  name: z.string().min(1).optional(),
  role: z.enum(["staff", "admin"]).optional(),
  password: z.string().min(6).optional(),
});

async function updateUser(req: Request, res: Response, next: NextFunction) {
  const { id, ...restParams } = updateUserSchema.parse({
    id: parseInt(req.params.id),
    ...req.body,
  });

  const user = await userService.getRepository().findOneBy({ id });

  if (!user) throw new NotFoundError("User not found");

  const userSaved = await userService.updateUser(user, restParams);

  return res.status(200).json(userView.renderUser(userSaved));
}

const deleteUserSchema = z.object({
  id: z.number().int(),
});

async function deleteUser(req: Request, res: Response, next: NextFunction) {
  const { id } = deleteUserSchema.parse({
    id: parseInt(req.params.id),
  });

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
