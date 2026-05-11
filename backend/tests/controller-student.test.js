import request from "supertest";

import app from "./test-app.js";

import { db } from "../config/firestore.js";
import cacheService from "../config/caching.js";

jest.mock("../utils/analyze_activity1.js", () => ({
  analyzeVideo: jest.fn(),
}));
jest.mock("../utils/analyze_activity3.js", () => ({
  analyzeVideo: jest.fn(),
}));
jest.mock("../utils/analyze_activity7.js", () => ({
  analyzeVideo: jest.fn(),
}));

jest.mock("../config/firestore.js", () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock("../config/caching.js", () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}));

describe("Student Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("login", () => {
    it("should login successfully", async () => {
      const response = await request(app).get("/login");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(response.body.message).toContain("test@mail.com");
    });
  });

  describe("register", () => {
    it("should create new student", async () => {
      const setMock = jest.fn();

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
          set: setMock,
        })),
      });

      const response = await request(app).post("/register").send({
        firstName: "John",
        grade: 10,
      });

      expect(response.status).toBe(200);

      expect(setMock).toHaveBeenCalled();
    });

    it("should not create existing student", async () => {
      const setMock = jest.fn();

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
          }),
          set: setMock,
        })),
      });

      const response = await request(app).post("/register").send({
        firstName: "John",
        grade: 10,
      });

      expect(response.status).toBe(200);

      expect(setMock).not.toHaveBeenCalled();
    });
  });

  describe("getDetail", () => {
    it("should return cached user", async () => {
      cacheService.get.mockReturnValue({
        id: "user123",
      });

      const response = await request(app).get("/detail");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });

    it("should return 400 if user not found", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
        })),
      });

      const response = await request(app).get("/detail");

      expect(response.status).toBe(400);
    });

    it("should fetch user detail successfully", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
            id: "user123",
            data: () => ({
              firstName: "John",
            }),
          }),
        })),
      });

      const response = await request(app).get("/detail");

      expect(response.status).toBe(200);

      expect(response.body.user.firstName).toBe("John");

      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe("updateDetail", () => {
    it("should update user successfully", async () => {
      const updateMock = jest.fn();

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
          }),
          update: updateMock,
        })),
      });

      const response = await request(app).put("/detail").send({
        firstName: "Updated",
        appearance: false,
      });

      expect(response.status).toBe(200);

      expect(updateMock).toHaveBeenCalledWith({
        firstName: "Updated",
        appearance: false,
      });

      expect(cacheService.del).toHaveBeenCalled();
    });

    it("should return 400 if user not found", async () => {
      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
        })),
      });

      const response = await request(app).put("/detail").send({
        firstName: "Updated",
      });

      expect(response.status).toBe(400);
    });
  });
});
