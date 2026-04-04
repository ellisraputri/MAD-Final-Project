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
  rankings.sort((a, b) => b.averageScore - a.averageScore);

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

  console.log("🌍 Daily summary ranking updated");
};