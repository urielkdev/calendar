import { NextFunction, Request, Response } from "express";

import dbConnection from "../../database/db-connection";
import User from "../entities/UserEntity";
import UserView from "../views/UserView";

// TODO: remove this function, its just to test the auth and token
async function index(req: Request, res: Response) {
  return res.json({ user: req.userToken });
}

async function getUsers(req: Request, res: Response, next: NextFunction) {
  const userRepository = dbConnection.getRepository(User);

  const users = await userRepository.find();

  return res.json(UserView.renderUsers(users));
}

async function createUser(req: Request, res: Response, next: NextFunction) {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Missing params" });

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

  if (!user) return res.status(404).json({ message: "User not found" });

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

  if (!user) return res.status(404).json({ message: "User not found" });

  // TODO: check if id soft delete the schedules cascade
  const userDeleted = await userRepository
    .softRemove(user)
    .catch((error) => console.log(error));

  if (!userDeleted)
    return res.status(422).json({ message: "Error updating user" });

  return res.status(200).json(UserView.renderUser(userDeleted));
}

export default { index, getUsers, createUser, updateUser, deleteUser };
