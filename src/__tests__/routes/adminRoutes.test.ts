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

describe("GET /admin/users", () => {
  beforeEach(async () => clearDatabase());

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
  beforeEach(async () => clearDatabase());

  it("should get all users report and sum their shiftHours", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const schedule2 = await factory.createSchedule({ user });
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

  it("should get all users report filtered by startDate", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date = new Date(schedule1.date.getTime() + milisecondsInDay);
    const schedule2 = await factory.createSchedule({ user, date });

    const response = await testAgent
      .get("/admin/users/report")
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate: schedule2.date });

    expect(response.statusCode).toBe(200);

    const userFound = response.body.users.find((u: any) => u.id == user.id);

    expect(userFound).toBeDefined();
    expect(userFound.totalHours).toBeCloseTo(schedule2.shiftHours);
  });

  it("should get all users report filtered by endDate", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date = new Date(schedule1.date.getTime() + milisecondsInDay);
    await factory.createSchedule({ user, date });

    const response = await testAgent
      .get("/admin/users/report")
      .set("Authorization", `Bearer ${token}`)
      .query({ endDate: schedule1.date });

    expect(response.statusCode).toBe(200);

    const userFound = response.body.users.find((u: any) => u.id == user.id);

    expect(userFound).toBeDefined();
    expect(userFound.totalHours).toBeCloseTo(schedule1.shiftHours);
  });

  it("should get all users report filtered by startDate and endDate and sum their shiftHours", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date2 = new Date(schedule1.date.getTime() + milisecondsInDay);
    const schedule2 = await factory.createSchedule({ user, date: date2 });
    const date3 = new Date(schedule2.date.getTime() + milisecondsInDay);
    await factory.createSchedule({ user, date: date3 });

    const response = await testAgent
      .get("/admin/users/report")
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate: schedule2.date, endDate: schedule2.date });

    expect(response.statusCode).toBe(200);

    const userFound = response.body.users.find((u: any) => u.id == user.id);

    expect(userFound).toBeDefined();
    expect(userFound.totalHours).toBeCloseTo(schedule2.shiftHours);
  });
});
