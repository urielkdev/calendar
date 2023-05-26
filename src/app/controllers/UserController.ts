import { NextFunction, Request, Response } from "express";

import userRepository from "../repositories/UserRepository";
import usersView from "../views/UserView";

async function index(req: Request, res: Response) {
  return res.json({ user: req.userToken });
}

async function store(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing params" });

    const createdUser = await userRepository.create(req.body);

    console.log(createdUser);
    return res.json(usersView.renderUser(createdUser));
  } catch (error) {
    next(error);
  }
}

export default { index, store };
