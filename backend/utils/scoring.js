import { db } from "../config/firestore.js";
import path from "path";
import fs from "fs";
import { downloadVideo } from "../temp/helper.js";
import { analyzeVideo } from "./analyze_activity1.js";

const calculateScore = (pred, actual) => {
  const actualSafe = actual === 0 ? 0.00001 : actual;
  let score = 1 - Math.abs(pred - actualSafe) / actualSafe;
  return Math.max(0, score);
};

const getMedias = async (medias) => {
  const mediaRefs = medias.map(id =>
    db.collection("medias").doc(id)
  );

  const mediaDocs = await db.getAll(...mediaRefs);

  return mediaDocs.map((doc, i) => {
    if (!doc.exists) {
      throw new Error(`Media ${medias[i]} not found`);
    }
    return doc.data();
  });
};

export const scorePredictions = async (medias, predictions, activityId) => {
  let outcomes = [];

  if (activityId !== '1') {
    return [0, 0, 0];
  }

  const mediaList = await getMedias(medias);
  console.log('medialis: ', mediaList);

  for (let i = 0; i < mediaList.length; i++) {
    const tempPath = path.resolve(`./temp/video_${i}.mp4`);

    try {
      const videoUrl = mediaList[i].content;

      await downloadVideo(videoUrl, tempPath);
      const result = await analyzeVideo(tempPath);

      const pred = predictions[i]?.prediction ?? 0;
      const score = calculateScore(pred, result.touch_time);

      outcomes.push({
        touch_time: result.touch_time,
        stop_time: result.stop_time,
        prediction: pred,
        score
      });

    } catch (err) {
      console.error("Processing error:", err);

      outcomes.push({
        touch_time: null,
        stop_time: null,
        prediction: predictions[i]?.prediction ?? null,
        score: 0,
        error: true
      });

    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  return outcomes;
};