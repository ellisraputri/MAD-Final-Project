import cacheService from "../config/caching.js";
import { error400, error500 } from "../config/error.js";
import { db } from "../config/firestore.js";

export const generateDailySummary = async () => {
  const now = new Date();
  const snapshot = await db.collection("results").get();
  const grouped = {};

  // 🔹 Group by activityId
  snapshot.forEach(doc => {
    const data = doc.data();
    const key = data.activityId;

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push({
      ...data,
      resultId: doc.id, 
    });
  });

  // 🔹 Process each activity
  for (const activityId in grouped) {
    const records = grouped[activityId];

    // Sort by score DESC
    records.sort((a, b) => b.score - a.score);

    // Assign ranking
    const rankings = records.map((item, index) => ({
      resultId: item.resultId, 
      teamId: item.teamId,
      score: item.score,
      rank: index + 1,
      attemptNo: item.attemptNo,
      timestamp: item.timestamp,
    }));

    // Save summary
    await db.collection("summaries").doc(activityId).set({
      activityId,
      rankings,
      updatedAt: now
    });
  }

  const teamMap = {};

  // 🔹 Step 1: Group → teamId → activityId → best score
  snapshot.forEach(doc => {
    const data = doc.data();
    const { teamId, activityId, score } = data;

    if (!teamMap[teamId]) {
      teamMap[teamId] = {};
    }

    if (!teamMap[teamId][activityId]) {
      teamMap[teamId][activityId] = score;
    } else {
      // take BEST score per activity
      teamMap[teamId][activityId] = Math.max(
        teamMap[teamId][activityId],
        score
      );
    }
  });

  // 🔹 Step 2: Compute averages
  const rankings = Object.keys(teamMap).map(teamId => {
    const activities = Object.values(teamMap[teamId]);

    const avg =
      activities.reduce((sum, val) => sum + val, 0) /
      activities.length;

    return {
      teamId,
      score: avg,
      totalActivities: activities.length,
    };
  });

  // 🔹 Step 3: Sort (DESC)
  rankings.sort((a, b) => b.score - a.score);

  // 🔹 Step 4: Assign rank
  const ranked = rankings.map((team, index) => ({
    ...team,
    rank: index + 1,
  }));

  // 🔹 Step 5: Save (overwrite)
  await db.collection("summaries").doc("global").set({
    activityId: "global",
    rankings: ranked,
    updatedAt: new Date(),
  });

  cacheService.del(`summary.global.rankings`);
  cacheService.del(`summary.global.updatedAt`);
  for (let i=1; i<=7; i++){
    cacheService.del(`summary.activity.${i}.rankings`);
    cacheService.del(`summary.activity.${i}.updatedAt`);
  }

  console.log("🌍 Daily summary ranking updated");
};

export const getGlobalRank = async(req, res) => {
    try {
        const rankings = cacheService.get(`summary.global.rankings`);
        const updatedAt = cacheService.get(`summary.global.updatedAt`);

        if (rankings && updatedAt) {
          return res.status(200).json({
              rankings: rankings, 
              updatedAt: updatedAt,
              success: true,
              message: "Global rank found",
          });
        }

        const summaryRef = db.collection("summaries").doc("global");
        const doc = await summaryRef.get();

        if (!doc.exists) {
            return error400(res, "Global rank not found");
        }

        cacheService.set(`summary.global.rankings`, doc.data().rankings);
        cacheService.set(`summary.global.updatedAt`, doc.data().updatedAt);

        return res.status(200).json({
            rankings: doc.data().rankings, 
            updatedAt: doc.data().updatedAt,
            success: true,
            message: "Global rank found",
        });

    } catch (error) {
        console.error(error);
        return error500(res);
    }
}

export const getActivityRank = async(req, res) => {
    try {
        const {id} = req.params;

        const rankings = cacheService.get(`summary.activity.${id}.rankings`);
        const updatedAt = cacheService.get(`summary.activity.${id}.updatedAt`);

        if (rankings && updatedAt) {
          return res.status(200).json({
              rankings: rankings, 
              updatedAt: updatedAt,
              success: true,
              message: "Activity rank found",
          });
        }

        const summaryRef = db.collection("summaries").doc(id);
        const doc = await summaryRef.get();

        if (!doc.exists) {
            return error400(res, `Activity ${id} rank not found`);
        }

        cacheService.set(`summary.activity.${id}.rankings`, doc.data().rankings);
        cacheService.set(`summary.activity.${id}.updatedAt`, doc.data().updatedAt);

        return res.status(200).json({
            rankings: doc.data().rankings, 
            updatedAt: doc.data().updatedAt,
            success: true,
            message: "Activity rank found",
        });

    } catch (error) {
        console.error(error);
        return error500(res);
    }
}