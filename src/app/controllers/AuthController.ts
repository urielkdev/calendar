import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";
import dbConnection from "../../database/db-connection";
import usersView from "../../views/usersView";

class AuthController {
  async authenticate(req: Request, res: Response) {
    const userRepository = dbConnection.getRepository(User);
    const { email, password } = req.body;

    const user = await userRepository.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: "Unable to login" });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!email || !password)
      return res.status(400).json({ message: "Unable to create user" });

    if (!validPassword)
      return res.status(401).json({ message: "Unable to login" });

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
      }
    );

    return res.json({ user: usersView.renderUser(user), token });
  }
}

export default new AuthController();
