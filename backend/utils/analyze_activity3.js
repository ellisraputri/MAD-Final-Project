import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeVideo3 = (videoPath) => {
  return new Promise((resolve, reject) => {
    const fixedPath = videoPath.replace(".mp4", `_fixed.mp4`);

    const ffmpeg = spawn("ffmpeg", [
      "-y",
      "-i",
      videoPath,
      "-vcodec",
      "libx264",
      "-acodec",
      "aac",
      fixedPath,
    ]);

    ffmpeg.on("error", (err) => {
      console.error("FFMPEG ERROR:", err);
    });

    ffmpeg.on("close", (ffmpegCode) => {
      if (ffmpegCode !== 0) {
        if (fs.existsSync(fixedPath)) {
          fs.unlinkSync(fixedPath);
        }
        return reject("FFmpeg failed");
      }

      const pythonPath = process.env.NODE_ENV === "production"
          ? "python3"
          : path.join(__dirname, "../scripts/.venv/Scripts/python.exe");
      const scriptPath = path.join(__dirname, "../scripts/activity3.py");

      const py = spawn(pythonPath, [scriptPath, fixedPath]);

      let data = "";
      let error = "";

      py.stdout.on("data", (chunk) => {
        data += chunk.toString();
      });

      py.stderr.on("data", (err) => {
        error += err.toString();
      });

      py.on("close", (code) => {
        if (fs.existsSync(fixedPath)) {
          fs.unlinkSync(fixedPath);
        }

        if (code !== 0) {
          return reject(error);
        }

        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject("Invalid JSON: " + data);
        }
      });
    });
  });
};
