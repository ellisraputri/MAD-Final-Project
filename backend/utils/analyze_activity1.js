import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(__dirname, "../scripts/.venv/Scripts/python.exe");
    const scriptPath = path.join(__dirname, "../scripts/activity1.py");
    const modelPath = path.join(__dirname, "../scripts/model/yolov8s.pt");

    const py = spawn(pythonPath, [scriptPath, videoPath, modelPath]);

    let data = "";
    let error = "";

    py.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    py.stderr.on("data", (err) => {
      error += err.toString();
    });

    py.on("close", (code) => {
      if (code !== 0) {
        return reject(error);
      }

      try {
        const result = JSON.parse(data);
        resolve(result);
        console.log(result);
      } catch (e) {
        reject("Invalid JSON: " + data);
      } finally{
        console.log('sukkses');
      }
    });
  });
};