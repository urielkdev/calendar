import factory from "../factory";
import { dbConnection } from "../../database/dbConnection";
import scheduleService from "../../app/services/scheduleService";
import testAgent from "../testAgent";
import userService from "../../app/services/userService";
import utils from "../../utils/utils";

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
  it("should get all users", async () => {
    const user = await factory.createUser();

    const res = await testAgent
      .get("/admin/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const userFound = utils.findById(res.body.users, user.id);

    expect(userFound).toBeDefined();
  });
});

describe("GET /admin/users/reports", () => {
  it("should get all users report and sum their shiftHours", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const schedule2 = await factory.createSchedule({ user });
    const schedules = [schedule1, schedule2];

    const res = await testAgent
      .get("/admin/users/reports")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const userFound = utils.findById(res.body.users, user.id);

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

    const res = await testAgent
      .get("/admin/users/reports")
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate: schedule2.date });

    expect(res.statusCode).toBe(200);
    const userFound = utils.findById(res.body.users, user.id);

    expect(userFound).toBeDefined();
    expect(userFound.totalHours).toBeCloseTo(schedule2.shiftHours);
  });

  it("should get all users report filtered by endDate", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date = new Date(schedule1.date.getTime() + milisecondsInDay);
    await factory.createSchedule({ user, date });

    const res = await testAgent
      .get("/admin/users/reports")
      .set("Authorization", `Bearer ${token}`)
      .query({ endDate: schedule1.date });

    expect(res.statusCode).toBe(200);
    const userFound = utils.findById(res.body.users, user.id);

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

    const res = await testAgent
      .get("/admin/users/reports")
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate: schedule2.date, endDate: schedule2.date });

    expect(res.statusCode).toBe(200);

    const userFound = utils.findById(res.body.users, user.id);

    expect(userFound).toBeDefined();
    expect(userFound.totalHours).toBeCloseTo(schedule2.shiftHours);
  });

  it("should not show a user in the response when he doesnt have a schedule", async () => {
    const user = await factory.createUser();

    const res = await testAgent
      .get("/admin/users/reports")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const userFound = utils.findById(res.body.users, user.id);

    expect(userFound).toBeUndefined();
  });

  it("should not show a user in the response when he doesnt have a schedule query date range", async () => {
    const user = await factory.createUser();
    const schedule = await factory.createSchedule({ user });

    const date = new Date(schedule.date.getTime() + milisecondsInDay);

    const res = await testAgent
      .get("/admin/users/reports")
      .set("Authorization", `Bearer ${token}`)
      .query({ startDate: date });

    expect(res.statusCode).toBe(200);

    const userFound = utils.findById(res.body.users, user.id);

    expect(userFound).toBeUndefined();
  });
});

describe("PUT /admin/users/:id", () => {
  it("It should update user", async () => {
    const user = await factory.createUser({ role: "staff" });

    const reqBody = {
      name: user.name + "123",
      role: "admin",
    };

    const res = await testAgent
      .put(`/admin/users/${user.id}`)
      .send(reqBody)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(reqBody.name);
    expect(res.body.role).toBe(reqBody.role);

    const dbUser = await userService.getRepository().findOneBy({ id: user.id });

    expect(dbUser).toBeDefined();
    if (!dbUser) return;

    expect(dbUser.name).toBe(reqBody.name);
    expect(dbUser.role).toBe(reqBody.role);
  });

  it("It should get an error 404 when nonexistent user was passed", async () => {
    const user = await factory.createUser({ role: "staff" });
    const { id } = user;
    await userService.getRepository().remove(user);

    const reqBody = {
      name: user.name + "123",
      role: "admin",
    };

    const res = await testAgent
      .put(`/admin/users/${id}`)
      .send(reqBody)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /admin/users/:id", () => {
  it("should soft delete a user", async () => {
    const user = await factory.createUser();

    const res = await testAgent
      .delete(`/admin/users/${user.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(user.id);
    expect(res.body.email).toBe(user.email);

    const dbUser = await userService.getRepository().findOneBy({ id: user.id });

    expect(dbUser).toBeNull();
  });

  it("should get an error 404 when nonexistent user was passed", async () => {
    const user = await factory.createUser();
    const { id: userId } = user;
    await userService.getRepository().remove(user);

    const res = await testAgent
      .delete(`/admin/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

describe("POST /admin/users/:userId/schedules", () => {
  it("should create a schedule for :userId", async () => {
    const user = await factory.createUser();

    const mockSchedule = factory.buildSchedule();
    const reqBody = {
      date: mockSchedule.date,
      shiftHours: mockSchedule.shiftHours,
    };

    const res = await testAgent
      .post(`/admin/users/${user.id}/schedules`)
      .send(reqBody)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.date).toBe(utils.dateToMySqlFormat(reqBody.date));
    expect(res.body.shiftHours).toBeCloseTo(reqBody.shiftHours);

    const dbSchedule = await scheduleService
      .getRepository()
      .findOneBy({ id: res.body.id });

    expect(dbSchedule).toBeDefined();
  });

  it("should get an error 404 when nonexistent user was passed", async () => {
    const user = await factory.createUser();
    const { id: userId } = user;
    await userService.getRepository().remove(user);

    const mockSchedule = factory.buildSchedule();
    const reqBody = {
      date: mockSchedule.date,
      shiftHours: mockSchedule.shiftHours,
    };

    const res = await testAgent
      .post(`/admin/users/${userId}/schedules`)
      .send(reqBody)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

describe("GET /admin/users/:userId/schedules", () => {
  it("It should get empty schedules when given user dont have a schedule", async () => {
    const user = await factory.createUser();

    const res = await testAgent
      .get(`/admin/users/${user.id}/schedules`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    expect(res.body.schedules.length).toBe(0);
  });

  it("should get the schedules for given user", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const schedule2 = await factory.createSchedule({ user });
    const schedules = [schedule1, schedule2];

    const res = await testAgent
      .get(`/admin/users/${user.id}/schedules`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    schedules.forEach((schedule) => {
      // const scheduleFound = res.body.schedules.find(
      //   (s: any) => s.id == schedule.id
      // );

      const scheduleFound = utils.findById(res.body.schedules, schedule.id);

      expect(scheduleFound).toBeDefined();
    });
  });

  it("should get schedules for given user filtered by startDate", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date = new Date(schedule1.date.getTime() + milisecondsInDay);
    const schedule2 = await factory.createSchedule({ user, date });

    const res = await testAgent
      .get(`/admin/users/${user.id}/schedules`)
      .query({ startDate: schedule2.date })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const schedule1Found = utils.findById(res.body.schedules, schedule1.id);
    const schedule2Found = utils.findById(res.body.schedules, schedule2.id);

    expect(schedule1Found).toBeUndefined();
    expect(schedule2Found).toBeDefined();
  });

  it("should get schedules for given user filtered by endDate", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date = new Date(schedule1.date.getTime() + milisecondsInDay);
    const schedule2 = await factory.createSchedule({ user, date });

    const res = await testAgent
      .get(`/admin/users/${user.id}/schedules`)
      .query({ endDate: schedule1.date })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const schedule1Found = utils.findById(res.body.schedules, schedule1.id);
    const schedule2Found = utils.findById(res.body.schedules, schedule2.id);

    expect(schedule1Found).toBeDefined();
    expect(schedule2Found).toBeUndefined();
  });

  it("should get schedules for given user filtered by start and endDate", async () => {
    const user = await factory.createUser();
    const schedule1 = await factory.createSchedule({ user });
    const date2 = new Date(schedule1.date.getTime() + milisecondsInDay);
    const schedule2 = await factory.createSchedule({ user, date: date2 });
    const date3 = new Date(schedule2.date.getTime() + milisecondsInDay);
    const schedule3 = await factory.createSchedule({ user, date: date3 });

    const res = await testAgent
      .get(`/admin/users/${user.id}/schedules`)
      .query({ startDate: schedule2.date, endDate: schedule2.date })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    const schedule1Found = utils.findById(res.body.schedules, schedule1.id);
    const schedule2Found = utils.findById(res.body.schedules, schedule2.id);
    const schedule3Found = utils.findById(res.body.schedules, schedule3.id);

    expect(schedule1Found).toBeUndefined();
    expect(schedule2Found).toBeDefined();
    expect(schedule3Found).toBeUndefined();
  });

  it("should get an error 404 when nonexistent user was passed", async () => {
    const user = await factory.createUser();
    const { id: userId } = user;
    await factory.createSchedule({ user });
    await userService.getRepository().softRemove(user);

    const res = await testAgent
      .get(`/admin/users/${userId}/schedules`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

describe("PUT /admin/schedules/:id", () => {
  it("It should update schedule", async () => {
    const schedule = await factory.createSchedule();

    const reqBody = {
      shiftHours: schedule.shiftHours + 1,
    };

    const res = await testAgent
      .put(`/admin/schedules/${schedule.id}`)
      .send(reqBody)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.shiftHours).toBeCloseTo(reqBody.shiftHours);

    const dbSchedule = await scheduleService
      .getRepository()
      .findOneBy({ id: schedule.id });

    expect(dbSchedule).toBeDefined();
    if (!dbSchedule) return;

    expect(dbSchedule.shiftHours).toBeCloseTo(reqBody.shiftHours);
  });

  it("It should get an error 404 when nonexistent schedule was passed", async () => {
    const schedule = await factory.createSchedule();
    const { id } = schedule;
    await scheduleService.getRepository().remove(schedule);

    const reqBody = {
      shiftHours: schedule.shiftHours + 1,
    };

    const res = await testAgent
      .put(`/admin/schedules/${id}`)
      .send(reqBody)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /admin/schedules/:id", () => {
  it("should soft delete a schedule", async () => {
    const schedule = await factory.createSchedule();

    const res = await testAgent
      .delete(`/admin/schedules/${schedule.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(schedule.id);

    const dbSchedule = await scheduleService
      .getRepository()
      .findOneBy({ id: schedule.id });

    expect(dbSchedule).toBeNull();
  });

  it("should get an error 404 when nonexistent schedule was passed", async () => {
    const schedule = await factory.createSchedule();
    const { id } = schedule;
    await scheduleService.getRepository().remove(schedule);

    const res = await testAgent
      .delete(`/admin/schedules/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
  });
});
