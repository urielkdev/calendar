import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { UnauthorizedError } from "../../utils/Errors";
import User from "../entities/UserEntity";

async function login(user: User, passwordToCheck: string) {
  const validPassword = await bcrypt.compare(passwordToCheck, user.password);

  if (!validPassword) throw new UnauthorizedError("Unable to login");

  return jwt.sign(
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
}

export default {
  login,
};
