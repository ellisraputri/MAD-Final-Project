import fs from "fs";

import { db } from "../config/firestore.js";

import {
  scorePredictions,
  scoreActivity1,
  scoreActivity3,
  scoreActivity7,
  scoreActivity2456,
} from "../utils/scoring.js";

import { analyzeVideo } from "../utils/analyze_activity1.js";
import { analyzeVideo3 } from "../utils/analyze_activity3.js";
import { analyzeBreathing } from "../utils/analyze_activity7.js";

import { downloadMedia } from "../temp/helper.js";

jest.mock("../config/firestore.js", () => ({
  db: {
    collection: jest.fn(),
    getAll: jest.fn(),
  },
}));

jest.mock("../utils/analyze_activity1.js", () => ({
  analyzeVideo: jest.fn(),
}));

jest.mock("../utils/analyze_activity3.js", () => ({
  analyzeVideo3: jest.fn(),
}));

jest.mock("../utils/analyze_activity7.js", () => ({
  analyzeBreathing: jest.fn(),
}));

jest.mock("../temp/helper.js", () => ({
  downloadMedia: jest.fn(),
}));

jest.mock("fs", () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

describe("Scoring Utils", () => {
  beforeEach(() => {
    jest.resetAllMocks();

    db.collection.mockImplementation((name) => {
      if (name === "medias") {
        return {
          doc: jest.fn((id) => ({
            id,
          })),
        };
      }
    });
  });

  const mockMediaDocs = () => {
    db.getAll.mockResolvedValue([
      {
        exists: true,
        data: () => ({
          content: "https://example.com/media.mp4",
        }),
      },
    ]);
  };

  describe("scorePredictions", () => {
    it("should route to activity 1 scorer", async () => {
      mockMediaDocs();

      analyzeVideo.mockResolvedValue({
        touch_time: 10,
      });

      const result = await scorePredictions(["m1"], [{ prediction: 10 }], "1");

      expect(result[0].touch_time).toBe(10);
    });

    it("should route to activity 3 scorer", async () => {
      mockMediaDocs();

      analyzeVideo3.mockResolvedValue({
        max_bend: 50,
      });

      const result = await scorePredictions(["m1"], [{ prediction: 50 }], "3");

      expect(result[0].max_bend).toBe(50);
    });

    it("should route to activity 7 scorer", async () => {
      mockMediaDocs();

      analyzeBreathing.mockResolvedValue({
        breath_count: 20,
        bpm: 60,
      });

      const result = await scorePredictions(["m1"], [{ prediction: 60 }], "7");

      expect(result[0].bpm).toBe(60);
    });

    it("should route to activity2456 scorer", async () => {
      db.getAll.mockResolvedValue([]);
      const result = await scorePredictions(
        [],
        [
          {
            prediction: 10,
            outcome: 10,
          },
        ],
        "4",
      );

      expect(result[0].score).toBe(1);
    });
  });

  describe("scoreActivity1", () => {
    it("should score successfully", async () => {
      analyzeVideo.mockResolvedValue({
        touch_time: 10,
      });

      downloadMedia.mockResolvedValue();

      fs.existsSync.mockReturnValue(false);

      const mediaList = [
        {
          content: "url",
        },
      ];

      const predictions = [
        {
          prediction: 10,
        },
      ];

      const result = await scoreActivity1(mediaList, predictions);

      expect(result[0].score).toBe(1);
    });

    it("should handle processing error", async () => {
      analyzeVideo.mockRejectedValue(new Error("Failed"));

      downloadMedia.mockResolvedValue();

      fs.existsSync.mockReturnValue(false);

      const result = await scoreActivity1(
        [{ content: "url" }],
        [{ prediction: 10 }],
      );

      expect(result[0].error).toBe(true);
    });
  });

  describe("scoreActivity3", () => {
    it("should score activity 3", async () => {
      analyzeVideo3.mockResolvedValue({
        max_bend: 50,
      });

      downloadMedia.mockResolvedValue();

      fs.existsSync.mockReturnValue(false);

      const result = await scoreActivity3(
        [{ content: "url" }],
        [{ prediction: 50 }],
      );

      expect(result[0].score).toBe(1);
    });
  });

  describe("scoreActivity7", () => {
    it("should score activity 7", async () => {
      analyzeBreathing.mockResolvedValue({
        breath_count: 20,
        bpm: 60,
      });

      downloadMedia.mockResolvedValue();

      fs.existsSync.mockReturnValue(false);

      const result = await scoreActivity7(
        [{ content: "url" }],
        [{ prediction: 60 }],
      );

      expect(result[0].score).toBe(1);
    });
  });

  describe("scoreActivity2456", () => {
    it("should score normal activities", async () => {
      const result = await scoreActivity2456(
        [
          {
            prediction: 100,
            outcome: 100,
          },
        ],
        "4",
      );

      expect(result[0].score).toBe(1);
    });

    it("should rank activity 2 correctly", async () => {
      const result = await scoreActivity2456(
        [
          {
            prediction: 1,
            outcome: 90,
          },
          {
            prediction: 2,
            outcome: 80,
          },
        ],
        2,
      );

      expect(result.length).toBe(2);

      expect(result[0].realOutcome).toBeDefined();
    });
  });
});
