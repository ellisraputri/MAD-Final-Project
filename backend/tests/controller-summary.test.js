import request from "supertest";

import app from "./test-app.js";

import { db } from "../config/firestore.js";
import cacheService from "../config/caching.js";

import { generateDailySummary } from "../controller/summary.js";

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

describe("Summary Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("getGlobalRank", () => {
    it("should return cached global rank", async () => {
      cacheService.get
        .mockReturnValueOnce([
          {
            teamId: "t1",
            score: 90,
          },
        ])
        .mockReturnValueOnce("today");

      const response = await request(app).get("/summary/global");

      expect(response.status).toBe(200);

      expect(response.body.success).toBe(true);
    });

    it("should return 400 if global rank not found", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
        })),
      });

      const response = await request(app).get("/summary/global");

      expect(response.status).toBe(400);
    });

    it("should fetch global rank from firestore", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({
              rankings: [
                {
                  teamId: "t1",
                  score: 100,
                },
              ],
              updatedAt: "today",
            }),
          }),
        })),
      });

      const response = await request(app).get("/summary/global");

      expect(response.status).toBe(200);

      expect(response.body.rankings.length).toBe(1);

      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe("getActivityRank", () => {
    it("should return cached activity rank", async () => {
      cacheService.get
        .mockReturnValueOnce([
          {
            teamId: "t1",
          },
        ])
        .mockReturnValueOnce("today");

      const response = await request(app).get("/summary/activity/1");

      expect(response.status).toBe(200);
    });

    it("should return 400 if activity rank not found", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: false,
          }),
        })),
      });

      const response = await request(app).get("/summary/activity/1");

      expect(response.status).toBe(400);
    });

    it("should fetch activity rank from firestore", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({
              rankings: [
                {
                  teamId: "t1",
                  score: 99,
                },
              ],
              updatedAt: "today",
            }),
          }),
        })),
      });

      const response = await request(app).get("/summary/activity/1");

      expect(response.status).toBe(200);

      expect(response.body.rankings.length).toBe(1);

      expect(cacheService.set).toHaveBeenCalled();
    });
  });

  describe("generateDailySummary", () => {
    it("should generate summaries successfully", async () => {
      const setMock = jest.fn();

      const fakeDocs = [
        {
          id: "r1",
          data: () => ({
            activityId: 1,
            teamId: "team1",
            score: 80,
            attemptNo: 1,
            timestamp: "today",
          }),
        },
        {
          id: "r2",
          data: () => ({
            activityId: 1,
            teamId: "team2",
            score: 95,
            attemptNo: 1,
            timestamp: "today",
          }),
        },
        {
          id: "r3",
          data: () => ({
            activityId: 2,
            teamId: "team1",
            score: 70,
            attemptNo: 1,
            timestamp: "today",
          }),
        },
      ];

      db.collection.mockImplementation((name) => {
        if (name === "results") {
          return {
            get: jest.fn().mockResolvedValue({
              forEach: (cb) => {
                fakeDocs.forEach(cb);
              },
            }),
          };
        }

        if (name === "summaries") {
          return {
            doc: jest.fn(() => ({
              set: setMock,
            })),
          };
        }
      });

      await generateDailySummary();

      expect(setMock).toHaveBeenCalled();

      expect(cacheService.del).toHaveBeenCalled();
    });
  });
});
