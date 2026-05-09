import { db } from "../config/firestore.js";

const generateId = (length = 6) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const seedData = async () => {
  let teams = [];

  for (let i = 1; i <= 12; i++) {
    teams.push({
      name: `Team ${i}A`,
      grade: i,
      logo: "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
    });
    teams.push({
      name: `Team ${i}B`,
      grade: i,
      logo: "https://static.vecteezy.com/system/resources/previews/036/280/650/non_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg",
    });
  }

  try {
    const batch = db.batch();

    for (const team of teams) {
      const customId = generateId(6);
      const teamRef = db.collection("teams").doc(customId);

      batch.set(teamRef, {
        ...team,
        updatedAt: new Date(),
      });
    }

    await batch.commit();
    console.log(`Seeding ${teams.length} teams successfully!`);
    process.exit();
  } catch (error) {
    console.error("Error seeding data: ", error);
    process.exit(1);
  }
};

seedData();
