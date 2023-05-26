import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import userRepository from "../repositories/UserRepository";
import userView from "../views/UserView";

async function authenticate(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing params" });

  const user = await userRepository.getUserByEmail(email);

  if (!user) return res.status(401).json({ message: "Unable to login" });

  const validPassword = await bcrypt.compare(password, user.password);

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

  return res.json({ user: userView.renderUser(user), token });
}

export default {
  authenticate,
};
