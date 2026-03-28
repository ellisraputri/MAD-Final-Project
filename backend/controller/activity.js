import { db } from "../config/firestore.js";
import { error500 } from "../config/error.js";
import { activityModel } from "../models/activity.js";


export const getList = async (req, res) => {
  try {
    const snapshot = await db.collection("activities").get();
    if (snapshot.empty) {
      return res.status(200).json({
        activities: [],
        success: true,
        message: "No activities found",
      });
    }

    const activities = snapshot.docs.map(doc => (activityModel({
      id: doc.id,
      name: doc.data().name,
      type: doc.data().type,
      imageUrl: doc.data().imageUrl,
      description: doc.data().description
    })));

    return res.status(200).json({
      activities,
      success: true,
      message: "Activities fetched successfully",
    });

  } catch (error) {
    console.error(error);
    return error500(res);
  }
};