import { db } from "../config/firestore.js";

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

    return res.status(200).json({
      success: true,
      message: "result retrieved successfully",
      data: ranking.slice(0, 100),
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