import { db } from "../config/firestore.js";
import path from "path";
import fs from "fs";
import { analyzeVideo } from "./analyze_activity1.js";
import { downloadMedia } from "../temp/helper.js";
import { analyzeBreathing } from "./analyze_activity7.js";
import { analyzeVideo3 } from "./analyze_activity3.js";

const calculateScore = (pred, actual) => {
  if (actual == null || isNaN(actual)) return 0;
  const actualSafe = actual === 0 ? 0.00001 : actual;
  let score = 1 - Math.abs(pred - actualSafe) / actualSafe;
  return Math.max(0, score);
};

const getMedias = async (medias) => {
  const mediaRefs = medias.map((id) => db.collection("medias").doc(id));

  const mediaDocs = await db.getAll(...mediaRefs);

  return mediaDocs.map((doc, i) => {
    if (!doc.exists) {
      throw new Error(`Media ${medias[i]} not found`);
    }
    return doc.data();
  });
};

export const scorePredictions = async (medias, predictions, activityId) => {
  const mediaList = await getMedias(medias);
  console.log("medialist: ", mediaList);

  switch (activityId) {
    case "1":
      return await scoreActivity1(mediaList, predictions);
    case "3":
      return await scoreActivity3(mediaList, predictions);
    case "7":
      return await scoreActivity7(mediaList, predictions);
    case "2":
    case "4":
    case "5":
    case "6":
      return await scoreActivity2456(predictions, activityId);

    default:
      return [0, 0, 0];
  }
};

const processMediaList = async ({
  mediaList,
  predictions,
  getTempPath,
  analyzeFn,
  mapSuccess,
  mapError,
}) => {
  let outcomes = [];

  for (let i = 0; i < mediaList.length; i++) {
    const tempPath = getTempPath(i);

    try {
      const url = mediaList[i].content;

      await downloadMedia(url, tempPath);
      const result = await analyzeFn(tempPath);

      const pred = predictions[i]?.prediction ?? 0;
      outcomes.push(mapSuccess(result, pred));
    } catch (err) {
      console.error("Processing error:", err);

      const pred = predictions[i]?.prediction ?? null;
      outcomes.push(mapError(pred));
    } finally {
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  return outcomes;
};

export const scoreActivity1 = async (mediaList, predictions) => {
  return processMediaList({
    mediaList,
    predictions,

    getTempPath: (i) => path.resolve(`./temp/${Date.now()}_video1_${i}.mp4`),

    analyzeFn: analyzeVideo,

    mapSuccess: (result, pred) => ({
      touch_time: result.touch_time,
      prediction: pred,
      score: calculateScore(pred, result.touch_time),
    }),

    mapError: (pred) => ({
      touch_time: null,
      prediction: pred,
      score: 0,
      error: true,
    }),
  });
};

export const scoreActivity3 = async (mediaList, predictions) => {
  return processMediaList({
    mediaList,
    predictions,

    getTempPath: (i) => path.resolve(`./temp/${Date.now()}_video3_${i}.mp4`),

    analyzeFn: analyzeVideo3,

    mapSuccess: (result, pred) => ({
      max_bend: result.max_bend,
      prediction: pred,
      score: calculateScore(pred, result.max_bend),
    }),

    mapError: (pred) => ({
      max_bend: null,
      prediction: pred,
      score: 0,
      error: true,
    }),
  });
};

export const scoreActivity7 = async (mediaList, predictions) => {
  return processMediaList({
    mediaList,
    predictions,

    getTempPath: (i) => path.resolve(`./temp/${Date.now()}_audio7_${i}.mp4`),

    analyzeFn: analyzeBreathing,

    mapSuccess: (result, pred) => ({
      breath_count: result.breath_count,
      bpm: result.bpm,
      prediction: pred,
      score: calculateScore(pred, result.bpm),
    }),

    mapError: (pred) => ({
      breath_count: null,
      bpm: null,
      prediction: pred,
      score: 0,
      error: true,
    }),
  });
};

export const scoreActivity2456 = async (predictions, activityId) => {
  console.log(typeof activityId);
  if (activityId == 2) {
    const sorted = [...predictions].sort((a, b) => b.outcome - a.outcome);

    const rankMap = new Map();
    sorted.forEach((item, index) => {
      rankMap.set(item.prediction, index + 1);
    });

    predictions = predictions.map((item) => ({
      prediction: item.prediction,
      realOutcome: item.outcome, // 👈 keep original
      outcome: rankMap.get(item.prediction), // 👈 new ranked value
    }));
  }

  const outcomes = [];
  for (const prediction of predictions) {
    if (activityId != 2) {
      outcomes.push({
        outcome: prediction.outcome,
        score: calculateScore(prediction.prediction, prediction.outcome),
      });
    } else {
      outcomes.push({
        outcome: prediction.outcome,
        score: calculateScore(prediction.prediction, prediction.outcome),
        realOutcome: prediction.realOutcome,
      });
    }
  }

  return outcomes;
};
