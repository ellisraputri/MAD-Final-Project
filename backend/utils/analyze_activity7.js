import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeBreathing = (audioPath) => {
  return new Promise((resolve, reject) => {
    const pythonPath = process.env.NODE_ENV === "production"
        ? "python3"
        : path.join(__dirname, "../scripts/.venv/Scripts/python.exe");
    const scriptPath = path.join(__dirname, "../scripts/activity7.py");

    const py = spawn(pythonPath, [scriptPath, audioPath]);

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
      } finally {
        console.log("sukses777");
      }
    });
  });
};
