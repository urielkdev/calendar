import { NextFunction, Request, Response } from "express";
import dbConnection from "../../database/db-connection";

import User from "../models/User";
import usersView from "../../views/usersView";

class UserController {
  async store(req: Request, res: Response, next: NextFunction) {
    const userRepository = dbConnection.getRepository(User);
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing params" });

    const userExists = await userRepository.findOne({ where: { email } });

    if (userExists)
      return res.status(409).json({ message: "Email is alreay taken" });

    const user = userRepository.create({ name, email, password });
    const createdUser = await userRepository.save(user);
    console.log(createdUser);
    return res.json(usersView.renderUser(createdUser));
  }
}

export default new UserController();
