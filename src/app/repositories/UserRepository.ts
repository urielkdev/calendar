import { NextFunction, Request, Response } from "express";
import dbConnection from "../../database/db-connection";

import User from "../entities/UserEntity";

async function create({ name, email, password }: User): Promise<User> {
  const userRepository = dbConnection.getRepository(User);

  const userExists = await userRepository.findOne({ where: { email } });
  if (userExists) throw new Error("User already exists");

  const user = userRepository.create({ name, email, password });
  const createdUser = await userRepository.save(user);
  return createdUser;
}

async function getUserByEmail(email: string) {
  const userRepository = dbConnection.getRepository(User);

  return await userRepository.findOne({ where: { email } });
}

export default {
  create,
  getUserByEmail,
};
