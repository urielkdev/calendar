import { createDatabase } from "typeorm-extension";
import { dbConnection, dbOptions } from "../database/dbConnection";
import scheduleService from "../app/services/scheduleService";
import userService from "../app/services/userService";

export async function clearDatabase() {
  await scheduleService.getRepository().query("DELETE from schedules");
  return await userService.getRepository().query("DELETE from users");
}
