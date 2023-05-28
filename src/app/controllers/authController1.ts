import { Request, Response } from "express";

import { BadRequestError, UnauthorizedError } from "../../utils/Errors";

import authService from "../services/authService";
import userService from "../services/userService";
import userView from "../views/UserView";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

async function login(req: Request, res: Response) {
  const { email, password } = loginSchema.parse(req.body);

  const user = await userService.getRepository().findOne({ where: { email } });

  if (!user) throw new UnauthorizedError("Unable to login");

  const token = await authService.login(user, password);

  return res.json({ user: userView.renderUser(user), token });
}

export default { login };
