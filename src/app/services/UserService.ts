import User from "../entities/UserEntity";

import dbConnection from "../../database/dbConnection";

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

async function getUsers() {
  const userRepository = dbConnection.getRepository(User);

  return await userRepository.find();
}

// async function updateUser(id: number, params) {
//   const userRepository = dbConnection.getRepository(User);
//   const user = await userRepository.findOneByOrFail({ id });
//   mergear user com params
//   return await userRepository.save(user);
// }

export default {
  create,
  getUserByEmail,
  getUsers,
};
