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

jest.mock("firebase-admin/firestore", () => ({
  FieldPath: {
    documentId: jest.fn(),
  },
}));

describe("Team Controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("createTeam", () => {
    it("should create team successfully", async () => {
      const setMock = jest.fn();
      const updateMock = jest.fn();

      db.collection.mockImplementation((name) => {
        if (name === "students") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: true,
                data: () => ({
                  grade: 10,
                  teamId: null,
                }),
              }),
              update: updateMock,
            })),
          };
        }

        if (name === "teams") {
          return {
            doc: jest.fn(() => ({
              set: setMock,
            })),
          };
        }
      });

      const response = await request(app).post("/team/create").send({
        name: "Alpha",
        grade: 10,
      });

      expect(response.status).toBe(200);

      expect(setMock).toHaveBeenCalled();

      expect(updateMock).toHaveBeenCalled();

      expect(cacheService.del).toHaveBeenCalled();
    });

    it("should return 400 if name missing", async () => {
      const response = await request(app).post("/team/create").send({
        grade: 10,
      });

      expect(response.status).toBe(400);
    });

    it("should return 400 if user already has team", async () => {
      db.collection.mockImplementation((name) => {
        if (name === "students") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: true,
                data: () => ({
                  grade: 10,
                  teamId: "abc",
                }),
              }),
            })),
          };
        }
      });

      const response = await request(app).post("/team/create").send({
        name: "Alpha",
        grade: 10,
      });

      expect(response.status).toBe(400);
    });
  });

  describe("joinTeam", () => {
    it("should join team successfully", async () => {
      const updateMock = jest.fn();

      db.collection.mockImplementation((name) => {
        if (name === "students") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: true,
                data: () => ({
                  grade: 10,
                  teamId: null,
                }),
              }),
              update: updateMock,
            })),
          };
        }

        if (name === "teams") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: true,
                data: () => ({
                  grade: 10,
                }),
              }),
            })),
          };
        }
      });

      const response = await request(app).post("/team/join").send({
        teamId: "team1",
      });

      expect(response.status).toBe(200);

      expect(updateMock).toHaveBeenCalled();
    });

    it("should return 400 if team not found", async () => {
      db.collection.mockImplementation((name) => {
        if (name === "students") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: true,
                data: () => ({
                  grade: 10,
                  teamId: null,
                }),
              }),
            })),
          };
        }

        if (name === "teams") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: false,
              }),
            })),
          };
        }
      });

      const response = await request(app).post("/team/join").send({
        teamId: "team1",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("getDetail", () => {
    it("should return cached team", async () => {
      cacheService.get.mockReturnValue({
        id: "team1",
      });

      const response = await request(app).get("/team/team1");

      expect(response.status).toBe(200);
    });

    it("should fetch team detail successfully", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockImplementation((name) => {
        if (name === "teams") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: true,
                id: "team1",
                data: () => ({
                  name: "Alpha",
                }),
              }),
            })),
          };
        }

        if (name === "students") {
          return {
            where: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                docs: [
                  {
                    id: "u1",
                    data: () => ({
                      firstName: "John",
                    }),
                  },
                ],
              }),
            })),
          };
        }
      });

      const response = await request(app).get("/team/team1");

      expect(response.status).toBe(200);

      expect(response.body.team.members.length).toBe(1);

      expect(cacheService.set).toHaveBeenCalled();
    });

    it("should return 400 if team not found", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockImplementation((name) => {
        if (name === "teams") {
          return {
            doc: jest.fn(() => ({
              get: jest.fn().mockResolvedValue({
                exists: false,
              }),
            })),
          };
        }
      });

      const response = await request(app).get("/team/team1");

      expect(response.status).toBe(400);
    });
  });

  describe("editDetail", () => {
    it("should edit team successfully", async () => {
      const updateMock = jest.fn();

      db.collection.mockReturnValue({
        doc: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
          }),
          update: updateMock,
        })),
      });

      const response = await request(app).put("/team/edit").send({
        teamId: "team1",
        name: "Updated",
        logoUrl: "logo.jpg",
      });

      expect(response.status).toBe(200);

      expect(updateMock).toHaveBeenCalled();

      expect(cacheService.del).toHaveBeenCalled();
    });

    it("should return 400 if team missing", async () => {
      const response = await request(app).put("/team/edit").send({
        name: "Updated",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("getDetailBatch", () => {
    it("should return teams from cache", async () => {
      cacheService.get.mockReturnValue({
        id: "team1",
      });

      const response = await request(app)
        .post("/team/batch")
        .send({
          teamIds: ["team1"],
        });

      expect(response.status).toBe(200);

      expect(response.body.teams.length).toBe(1);
    });

    it("should fetch uncached teams", async () => {
      cacheService.get.mockReturnValue(null);

      db.collection.mockReturnValue({
        where: jest.fn(() => ({
          get: jest.fn().mockResolvedValue({
            docs: [
              {
                id: "team1",
                data: () => ({
                  name: "Alpha",
                  logo: "logo.jpg",
                }),
              },
            ],
          }),
        })),
      });

      const response = await request(app)
        .post("/team/batch")
        .send({
          teamIds: ["team1"],
        });

      expect(response.status).toBe(200);

      expect(response.body.teams.length).toBe(1);

      expect(cacheService.set).toHaveBeenCalled();
    });
  });
});
