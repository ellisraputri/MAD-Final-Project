import { db } from '../config/firestore.js';

const getTeamsWhoFinishedAll = async () => {
  const TOTAL_ACTIVITIES = 7;
  
  try {
    // 1. Fetch all result records (only need teamId and activityId)
    const snapshot = await db.collection('results').get();
    
    // 2. Map of TeamID -> Set of unique ActivityIDs
    const completionMap = {};

    snapshot.forEach(doc => {
      const { teamId, activityId } = doc.data();
      
      if (!completionMap[teamId]) {
        completionMap[teamId] = new Set();
      }
      
      completionMap[teamId].add(activityId);
    });

    // 3. Filter for teams that have 7 unique activities
    const finishedTeams = Object.keys(completionMap).filter(teamId => {
      return completionMap[teamId].size === TOTAL_ACTIVITIES;
    });

    console.log("Teams who finished everything:", finishedTeams);
    return finishedTeams;

  } catch (error) {
    console.error("Error building query:", error);
  }
};

getTeamsWhoFinishedAll();