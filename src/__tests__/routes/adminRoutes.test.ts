import { faker } from "@faker-js/faker";
import scheduleService from "../../app/services/scheduleService";
import userService from "../../app/services/userService";
import dbConnection from "../../database/dbConnection";
import clearDatabase from "../clearDatabase";
import factory from "../factory";
import testAgent from "../testAgent";

const milisecondsInDay = 24 * 60 * 60 * 1000;
let token = "";

beforeAll(async () => {
  await dbConnection.initialize();
  token = factory.buildToken("admin");
});

afterAll(async () => {
  dbConnection.destroy();
});

beforeEach(clearDatabase);

describe("GET /admin/users", () => {
  test("It should get all users", async () => {
    const user = await factory.createUser();

    const response = await testAgent
      .get("/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    const userFound = response.body.users.find((u: any) => u.id == user.id);

    expect(userFound).toBeDefined();
  });
});

describe("GET /admin/users/report", () => {
  it("should get all users report and sum their shiftHours", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date = new Date(schedule1.date.getTime() + milisecondsInDay);
    const schedule2 = await factory.createSchedule({ user, date });
    const schedules = [schedule1, schedule2];

    const response = await testAgent
      .get("/admin/users/report")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);

    const userFound = response.body.users.find((u: any) => u.id == user.id);

    expect(userFound).toBeDefined();

    const sumShiftHours = schedules.reduce(
      (acc, { shiftHours }) => acc + shiftHours,
      0
    );

    expect(userFound.totalHours).toBeCloseTo(sumShiftHours);
  });

  // it("should get all users report filtered by startDate and sum their shiftHours", async () => {
  //   const user = await factory.createUser();
  //   const schedule1 = await factory.createSchedule({ user });
  //   const date = new Date(schedule1.date.getTime() + milisecondsInDay);
  //   const schedule2 = await factory.createSchedule({ user, date });
  //   const schedules = [schedule1, schedule2];

  //   const response = await testAgent
  //     .get("/admin/users/report")
  //     .set("Authorization", `Bearer ${token}`)
  //     .query({ startDate: schedule1.date });

  //   expect(response.statusCode).toBe(200);

  //   console.log(date);
  //   console.log(schedules);
  //   console.log(response.body.users);

  //   const userFound = response.body.users.find((u: any) => u.id == user.id);

  //   expect(userFound).toBeDefined();

  //   expect(userFound.totalHours).toBeCloseTo(schedules[1].shiftHours);
  // });
});
