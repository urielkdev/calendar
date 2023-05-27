import { faker } from "@faker-js/faker";

import authService from "../app/services/authService";
import userService from "../app/services/userService";
import User from "../app/entities/UserEntity";
import Schedule from "../app/entities/ScheduleEntity";
import scheduleService from "../app/services/scheduleService";
import { DeepPartial } from "typeorm";

function buildToken(role: string, id?: number) {
  const adminUser = userService.getRepository().create({
    id: id || faker.number.int(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role,
  });

  return authService.generateJwt(adminUser);
}

function buildSchedule(params?: DeepPartial<Schedule>) {
  return scheduleService.getRepository().create({
    date: new Date(),
    shiftHours: faker.number.float({ max: 12 }),
    ...params,
  });
}

async function createSchedule(params?: DeepPartial<Schedule>) {
  return await scheduleService.getRepository().save(buildSchedule(params));
}

function buildUser(params?: DeepPartial<User>) {
  return userService.getRepository().create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: "123",
    ...params,
  });
}
async function createUser(params?: DeepPartial<User>) {
  return await userService.getRepository().save(buildUser(params));
}

export default {
  buildToken,
  buildSchedule,
  createSchedule,
  buildUser,
  createUser,
};
