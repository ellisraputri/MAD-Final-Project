import { error400, error500 } from "../config/error.js";
import { db } from "../config/firestore.js";
import { resultModel } from "../models/result.js";

const filterByActivity = (results, activityType) => {
  if (!activityType) return results;
  return results.filter(r => r.activityId === activityType);
};

const groupByTeam = (results) => {
  const map = new Map();

  results.forEach(r => {
    if (!map.has(r.teamId)) {
      map.set(r.teamId, []);
    }
    map.get(r.teamId).push(r);
  });

  return map;
};

const computeHighest = (grouped) => {
  const ranking = [];

  grouped.forEach((records, teamId) => {
    let best = records[0];

    records.forEach(r => {
      if (r.score > best.score) {
        best = r;
      }
    });

    ranking.push({
      teamId,
      score: best.score,
      attemptNo: best.attemptNo,
      resultId: best.id,
    });
  });

  return ranking;
};

const computeLatest = (grouped) => {
  const ranking = [];

  grouped.forEach((records, teamId) => {
    let latest = records[0];

    records.forEach(r => {
      if (r.timestamp.toDate() > latest.timestamp.toDate()) {
        latest = r;
      }
    });

    ranking.push({
      teamId,
      score: latest.score,
      attemptNo: latest.attemptNo,
      resultId: latest.id,
    });
  });

  return ranking;
};

const sortAndRank = (ranking) => {
  ranking.sort((a, b) => b.score - a.score);

  let currentRank = 1;

  ranking.forEach((item, index) => {
    if (index > 0 && item.score < ranking[index - 1].score) {
      currentRank = index + 1;
    }
    item.rank = currentRank;
  });

  return ranking;
};

const findTeam = (ranking, teamId) => {
  return ranking.find(r => r.teamId === teamId) || null;
};

export const getHighestRank = async (req, res) => {
  try {
    const { teamId, activityType } = req.query;

    const snapshot = await db.collection("results").get();
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filtered = filterByActivity(results, activityType);
    const grouped = groupByTeam(filtered);
    const ranking = sortAndRank(computeHighest(grouped));

    const team = findTeam(ranking, teamId);

    return res.status(200).json({
      success: true,
      message: "result retrieved successfully",
      data: team,
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const getTopRanking = async (req, res) => {
  try {
    const { activityType } = req.query;

    const snapshot = await db.collection("results").get();
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filtered = filterByActivity(results, activityType);
    const grouped = groupByTeam(filtered);
    const ranking = sortAndRank(computeHighest(grouped));

    const teamIds = [...new Set(ranking.map(r => r.teamId))];

    const teamDocs = await Promise.all(
      teamIds.map(id => db.collection("teams").doc(id).get())
    );

    const teamMap = {};
    teamDocs.forEach(doc => {
      if (doc.exists) {
        teamMap[doc.id] = doc.data();
      }
    });

    const enrichedRanking = ranking.map(item => ({
      ...item,
      teamName: teamMap[item.teamId]?.name || "Unknown",
      imageUrl: teamMap[item.teamId]?.logo || null,
    }));

    return res.status(200).json({
      success: true,
      message: "result retrieved successfully",
      data: enrichedRanking.slice(0, 100),
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const getLatestRank = async (req, res) => {
  try {
    const { teamId, activityType } = req.query;

    const snapshot = await db.collection("results").get();
    const results = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filtered = filterByActivity(results, activityType);
    const grouped = groupByTeam(filtered);
    const ranking = sortAndRank(computeLatest(grouped));

    const team = findTeam(ranking, teamId);

    return res.status(200).json({
      success: true,
      message: "result retrieved successfully",
      data: team,
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};

export const getResultList = async (req, res) => {
  try {
    const { teamId, activityId } = req.query;

    if (!teamId || !activityId) {
      return error400(res, "teamId and activityId are required");
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

    let score = 0;
    // TODO: model scoring

    const resultData = resultModel({
      activityId,
      teamId,
      attemptNo: newAttemptNo,
      score,
      medias,
      predictions,
    });

    await resultRef.add(resultData);

    return res.status(200).json({
      success: true,
      message: "Result saved successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
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