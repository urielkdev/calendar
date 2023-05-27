import scheduleService from "../app/services/scheduleService";
import userService from "../app/services/userService";
import dbConnection from "../database/dbConnection";

async function clearDatabase() {
  await scheduleService.getRepository().query("DELETE from schedules");
  await userService.getRepository().query("DELETE from users");
  return;
}

export default clearDatabase;
