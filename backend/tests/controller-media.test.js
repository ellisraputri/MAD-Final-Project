import request from "supertest";
import app from "./test-app.js";

import { db } from "../config/firestore.js";
import cloudinary from "../config/cloudinary.js";

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

jest.mock("../config/cloudinary.js", () => ({
  uploader: {
    upload_stream: jest.fn(),
  },
}));

describe("Media Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadMedia", () => {
    it("should upload media successfully", async () => {
      const setMock = jest.fn();

      const docMock = {
        id: "media123",
        set: setMock,
      };

      db.collection.mockReturnValue({
        doc: jest.fn(() => docMock),
      });

      const response = await request(app).post("/media").send({
        type: "image",
        content: "hello.jpg",
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        id: "media123",
        success: true,
        message: "Media uploaded successfully",
      });

      expect(setMock).toHaveBeenCalled();
    });

    it("should return 400 if body incomplete", async () => {
      const response = await request(app).post("/media").send({
        type: "image",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("uploadToCloudinary", () => {
    it("should upload file successfully", async () => {
      cloudinary.uploader.upload_stream.mockImplementation(
        (options, callback) => {
          return {
            end: () => {
              callback(null, {
                secure_url: "https://cloudinary.com/test.jpg",
              });
            },
          };
        },
      );

      const response = await request(app)
        .post("/cloudinary")
        .attach("file", Buffer.from("fake image"), "test.jpg");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        url: "https://cloudinary.com/test.jpg",
        success: true,
        message: "Upload to cloud success",
      });
    });

    it("should return 400 if no file uploaded", async () => {
      const response = await request(app).post("/cloudinary");

      expect(response.status).toBe(400);
    });

    it("should handle cloudinary errors", async () => {
      cloudinary.uploader.upload_stream.mockImplementation(
        (options, callback) => {
          return {
            end: () => {
              callback(new Error("Cloudinary failed"));
            },
          };
        },
      );

      const response = await request(app)
        .post("/cloudinary")
        .attach("file", Buffer.from("fake image"), "test.jpg");

      expect(response.status).toBe(500);
    });
  });
});
