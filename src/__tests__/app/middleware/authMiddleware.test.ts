import factory from "../../factory";
import {
  adminAuthMiddleware,
  staffAuthMiddleware,
} from "../../../app/middlewares/authMiddleware";
import { UnauthorizedError } from "../../../utils/Errors";
import { Request, Response } from "express";

let adminToken = "";
let staffToken = "";

beforeAll(async () => {
  adminToken = factory.buildToken("admin");
  staffToken = factory.buildToken("staff");
});

describe("adminAuthMiddleware/3", () => {
  it("should authorize a valid token with admin role", () => {
    const req = {
      headers: { authorization: `Bearer ${adminToken}` },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    adminAuthMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw an UnauthorizedError for a token of wrong role", () => {
    const req = {
      headers: { authorization: `Bearer ${staffToken}` },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    expect(() => adminAuthMiddleware(req, res, next)).toThrow(
      UnauthorizedError
    );
  });

  it("should throw an UnauthorizedError for a wrong token", () => {
    const req = { headers: {} } as Request;
    const res = {} as Response;
    const next = jest.fn();

    expect(() => adminAuthMiddleware(req, res, next)).toThrow(
      UnauthorizedError
    );
  });
});

describe("staffAuthMiddleware/3", () => {
  it("should authorize a valid token with staff role", () => {
    const req = {
      headers: { authorization: `Bearer ${staffToken}` },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    staffAuthMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw an UnauthorizedError for a token of wrong role", () => {
    const req = {
      headers: { authorization: `Bearer ${adminToken}` },
    } as Request;
    const res = {} as Response;
    const next = jest.fn();

    expect(() => staffAuthMiddleware(req, res, next)).toThrow(
      UnauthorizedError
    );
  });

  it("should throw an UnauthorizedError for a wrong token", () => {
    const req = { headers: {} } as Request;
    const res = {} as Response;
    const next = jest.fn();

    expect(() => staffAuthMiddleware(req, res, next)).toThrow(
      UnauthorizedError
    );
  });
});
