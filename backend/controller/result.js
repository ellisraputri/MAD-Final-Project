import cacheService from "../config/caching.js";
import { error400, error500 } from "../config/error.js";
import { db } from "../config/firestore.js";
import { resultModel } from "../models/result.js";
import { analyzeVideo } from "../utils/analyze_activity1.js";
import { scorePredictions } from "../utils/scoring.js";

export const getResultList = async (req, res) => {
  try {
    const { teamId, activityId } = req.query;

    if (!teamId || !activityId) {
      return error400(res, "teamId and activityId are required");
    }

    const cached = cacheService.get(`result.list.${teamId}.${activityId}`);
    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached,
        message: "Result list fetched successfully",
      });
    }

    const snapshot = db
      .collection("results")
      .where("teamId", "==", teamId)
      .where("activityId", "==", activityId)
      .orderBy("attemptNo", "asc"); // optional: sort attempts

    const results = (await snapshot.get()).docs.map(doc => ({
      resultId: doc.id,
      score: doc.data().score,
      attempt: doc.data().attemptNo,
    }));

    cacheService.set(`result.list.${teamId}.${activityId}`, results);

    return res.status(200).json({
      success: true,
      data: results,
      message: "Result list fetched successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const getResultDetail = async (req, res) => {
  try {
    const { resultId } = req.query;

    const cached = cacheService.get(`result.${resultId}`);
    if (cached) {
      return res.status(200).json({
        success: true,
        message: "Result detail fetched successfully",
        data: cached,
      });
    }

    const resultDoc = await db.collection("results").doc(resultId).get();
    if (!resultDoc.exists) {
      return error400(res, "Result not found");
    }

    const result = resultDoc.data();
    let mediaList = [];

    if (result.medias && result.medias.length > 0) {
      const mediaSnapshot = await db
        .collection("medias")
        .where("__name__", "in", result.medias)
        .get();

      const rawMedia = mediaSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const mediaMap = new Map();
      rawMedia.forEach(m => mediaMap.set(m.id, m));

      mediaList = result.medias.map(id => mediaMap.get(id) || null);
    }

    cacheService.set(`result.${resultId}`, {
      resultId: resultDoc.id,
      ...result,
      medias: mediaList
    });

    return res.status(200).json({
      success: true,
      message: "Result detail fetched successfully",
      data: {
        resultId: resultDoc.id,
        ...result,
        medias: mediaList,
      },
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const submitResult = async (req, res) => {
  try {
    const { activityId, teamId, medias, predictions } = req.body;

    cacheService.del(`result.list.${teamId}.${activityId}`);

    const resultRef = db.collection("results");

    const newAttemptNo = await db.runTransaction(async (transaction) => {
      const query = resultRef
        .where("teamId", "==", teamId)
        .where("activityId", "==", activityId)
        .orderBy("attemptNo", "desc")
        .limit(1);

      const snapshot = await transaction.get(query);

      let latestAttemptNo = 0;

      if (!snapshot.empty) {
        latestAttemptNo = snapshot.docs[0].data().attemptNo || 0;
      }

      return latestAttemptNo + 1;
    });

    // TODO: model scoring
    // activity 6 = loop predictions, ambil predictions[i].outcome
    const outcomes = await scorePredictions(medias, predictions, activityId);
    const score =
      outcomes.reduce((sum, o) => sum + (o.score || 0), 0) /
      (outcomes.length || 1);

    const resultData = resultModel({
      activityId,
      teamId,
      attemptNo: newAttemptNo,
      score,
      outcomes,
      medias,
      predictions,
    });

    const docRef = await resultRef.add(resultData);

    return res.status(200).json({
      success: true,
      message: "Result saved successfully",
      resultId: docRef.id,
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};


export const saveTeamResult67 = async ({ teamId, activityId, results }) => {
  const resultRef = db.collection("results");

  cacheService.del(`result.list.${teamId}.${activityId}`);

  const newAttemptNo = await db.runTransaction(async (transaction) => {
    const query = resultRef
      .where("teamId", "==", teamId)
      .where("activityId", "==", activityId)
      .orderBy("attemptNo", "desc")
      .limit(1);

    const snapshot = await transaction.get(query);

    let latestAttemptNo = 0;

    if (!snapshot.empty) {
      latestAttemptNo = snapshot.docs[0].data().attemptNo || 0;
    }

    return latestAttemptNo + 1;
  });

  let score = 0;
  // TODO: model scoring
  // activity 6 = loop predictions, ambil predictions[i].outcome

  const outcomes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const resultData = resultModel({
    activityId,
    teamId,
    attemptNo: newAttemptNo,
    score: 0,
    outcomes: outcomes,
    medias: results.flatMap(r => r.medias || []),
    predictions: results.flatMap(r => r.predictions),
  });

  await resultRef.add(resultData);
};

export const rate = async (req, res) => {
  try {
    const { resultId, ratings, comments } = req.body; 

    const resultRef = db.collection("results").doc(resultId);
    const doc = await resultRef.get();
    if (!doc.exists) {
      return error400(res, "Result not found");
    }

    await resultRef.update({
      ...(ratings && { ratings }),
      ...(comments && { comments }),
    });

    return res.status(200).json({
      success: true,
      message: "Rating done successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};