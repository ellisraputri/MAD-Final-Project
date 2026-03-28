import { db } from '../config/firestore.js';

const updateScoresAndOutcomes = async () => {
  try {
    const snapshot = await db.collection('results').get();

    const batch = db.batch();
    let count = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();

      if (data.score !== undefined) {
        let score = data.score;
        const newScore = score / 100;

        const outcomes = [
          newScore / 3,
          newScore / 3,
          newScore / 3,
        ];

        batch.update(doc.ref, {
          score: newScore,
          outcomes: outcomes,
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