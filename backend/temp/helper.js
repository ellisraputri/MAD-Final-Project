import fs from "fs";
import { pipeline } from "stream/promises";

export const downloadVideo = async (url, outputPath) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const fileStream = fs.createWriteStream(outputPath);
  await pipeline(response.body, fileStream);
};