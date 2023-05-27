import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { BadRequestError, UnauthorizedError } from "../../utils/Errors";

import userService from "../services/userService";
import userView from "../views/userView";

async function authenticate(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError("Missing params");

  const user = await userService.getUserByEmail(email);

  if (!user) throw new UnauthorizedError("Unable to login");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new UnauthorizedError("Unable to login");

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

export default { authenticate };
