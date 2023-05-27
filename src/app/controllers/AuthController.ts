import { Request, Response } from "express";

import { BadRequestError, UnauthorizedError } from "../../utils/Errors";

import authService from "../services/authService";
import userService from "../services/userService";
import userView from "../views/userView";

async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError("Missing params");

  const user = await userService.getRepository().findOne({ where: { email } });

  if (!user) throw new UnauthorizedError("Unable to login");

  const token = await authService.login(user, password);

  return res.json({ user: userView.renderUser(user), token });
}

export default { login };
