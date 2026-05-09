import { db } from "../config/firestore.js";

const updateScoresAndOutcomes = async () => {
  try {
    const snapshot = await db.collection("teams").get();

    const batch = db.batch();
    let count = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.logo === undefined || data.logo === null) {
        batch.update(doc.ref, {
          logo: "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
        });

        count++;
      }
    });

    await batch.commit();

    console.log(`Updated ${count} documents successfully!`);
    process.exit();
  } catch (error) {
    console.error("Update failed:", error);
    process.exit(1);
  }
};

updateScoresAndOutcomes();
