import { db } from "../config/firestore.js";

const seedData = async () => {
  try {
    const teams = await db.collection("teams").get();

    const teamDict = {};
    teams.forEach((doc) => {
      teamDict[doc.id] = doc.data().name;
    });

    let students = [];
    let i = 1;

    Object.keys(teamDict).forEach((key) => {
      const amount = Math.floor(Math.random() * 6) + 1;

      for (let j = 1; j <= amount; j++) {
        students.push({
          email: `student${i}@mail.com`,
          firstName: `Name${i}`,
          grade: parseInt(teamDict[key][5]),
          appearance: Math.random() < 0.5 ? true : false,
          teamId: key,
        });
        i++;
      }
    });

    const batch = db.batch();
    students.forEach((stud) => {
      const docRef = db.collection("students").doc();
      batch.set(docRef, stud);
    });

    await batch.commit();
    console.log(`Seeding ${students.length} completed successfully!`);
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
