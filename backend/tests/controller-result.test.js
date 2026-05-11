import request from "supertest";
import app from "./test-app.js";

import { db } from "../config/firestore.js";
import cacheService from "../config/caching.js";

import { scorePredictions } from "../utils/scoring.js";

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
    runTransaction: jest.fn(),
  },
}));

jest.mock("../config/caching.js", () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
}));

jest.mock("../utils/scoring.js", () => ({
  scorePredictions: jest.fn(),
}));

describe("Result Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getResultList", () => {
    it("should return cached result list", async () => {
      cacheService.get.mockReturnValue([
        {
          resultId: "r1",
          score: 90,
        },
      ]);

      const response = await request(app).get("/results").query({
        teamId: "team1",
        activityId: "1",
      });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);

      expect(cacheService.get).toHaveBeenCalled();
    });

    it("should return 400 if query incomplete", async () => {
      const response = await request(app).get("/results").query({
        teamId: "team1",
      });

      expect(response.status).toBe(400);
    });

    it("should fetch from firestore", async () => {
      cacheService.get.mockReturnValue(null);

      const getMock = jest.fn().mockResolvedValue({
        docs: [
          {
            id: "r1",
            data: () => ({
              score: 95,
              attemptNo: 1,
            }),
          },
        ],
      });

      const orderByMock = jest.fn(() => ({
        get: getMock,
      }));

      const where2Mock = jest.fn(() => ({
        orderBy: orderByMock,
      }));

      const where1Mock = jest.fn(() => ({
        where: where2Mock,
      }));

      db.collection.mockReturnValue({
        where: where1Mock,
      });

      const response = await request(app).get("/results").query({
        teamId: "team1",
        activityId: "1",
      });

      expect(response.status).toBe(200);

      expect(response.body.data.length).toBe(1);
    });
  });

  describe("getResultDetail", () => {
    it("should return cached result detail", async () => {
      cacheService.get.mockReturnValue({
        resultId: "r1",
      });

      const response = await request(app).get("/result").query({
        resultId: "r1",
      });

      expect(response.status).toBe(200);
    });

    it("should return 400 if result not found", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
        })),
      });

      const response = await request(app).get("/result").query({
        resultId: "r5",
      });

      expect(response.status).toBe(400);
    });

    it("should fetch result detail successfully", async () => {
      cacheService.get.mockReturnValue(null);

      const resultData = {
        medias: ["m1"],
      };

      db.collection.mockImplementation((name) => {
        if (name === "results") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: true,
                id: "r1",
                data: () => resultData,
              }),
            })),
          };
        }

        if (name === "medias") {
          return {
            where: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                docs: [
                  {
                    id: "m1",
                    data: () => ({
                      type: "image",
                    }),
                  },
                ],
              }),
            })),
          };
        }
      });

      const response = await request(app).get("/result").query({
        resultId: "r1",
      });

      expect(response.status).toBe(200);

      expect(response.body.data.medias.length).toBe(1);
    });
  });

  describe("submitResult", () => {
    it("should submit result successfully", async () => {
      db.runTransaction.mockResolvedValue(1);

      scorePredictions.mockResolvedValue([
        {
          score: 80,
        },
      ]);

      const addMock = jest.fn().mockResolvedValue({
        id: "result123",
      });

      const limitMock = jest.fn(() => ({}));

      const orderByMock = jest.fn(() => ({
        limit: limitMock,
      }));

      const where2Mock = jest.fn(() => ({
        orderBy: orderByMock,
      }));

      const where1Mock = jest.fn(() => ({
        where: where2Mock,
        add: addMock,
      }));

      db.collection.mockReturnValue({
        where: where1Mock,
        add: addMock,
      });

      const response = await request(app)
        .post("/result")
        .send({
          activityId: 1,
          teamId: "team1",
          medias: ["m1"],
          predictions: [],
        });

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe("rate", () => {
    it("should rate successfully", async () => {
      const updateMock = jest.fn();

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
          }),
          update: updateMock,
        })),
      });

      const response = await request(app).post("/rate").send({
        resultId: "r1",
        ratings: 5,
        comments: "Good",
      });

      expect(response.status).toBe(200);

      expect(updateMock).toHaveBeenCalled();
    });

    it("should return 400 if result not found", async () => {
      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
        })),
      });

      const response = await request(app).post("/rate").send({
        resultId: "r1",
      });

      expect(response.status).toBe(400);
    });
  });
});
