import { db } from "../config/firestore.js";

const seedWithBatch = async () => {
  const batch = db.batch();
  const activityData = [
    {
      id: "1",
      name: "Parachute Drop Challenge",
      type: "Engineering",
      description:
        "Students design, build, and test a parachute for a small toy to reduce its landing speed and impact force",
    },
    {
      id: "2",
      name: "Sound Pollution Hunter",
      type: "Engineering",
      description:
        "Students measure and compare sound levels in different classroom activities.",
    },
    {
      id: "3",
      name: "Hand Fan Challenge",
      type: "Engineering",
      description: "Students test how air movement affects flexible materials.",
    },
    {
      id: "4",
      name: "Earthquake-Resistant Structure",
      type: "Engineering",
      description:
        "Students design structures that withstand vibration, simulating earthquakes.",
    },
    {
      id: "5",
      name: "Human Performance Lab",
      type: "Medical",
      description:
        "Students investigate how the human body moves by measuring speed, smoothness...",
    },
    {
      id: "6",
      name: "Reaction Board Challenge",
      type: "Medical",
      description:
        "Students measure reaction time, coordination, and improvement through...",
    },
    {
      id: "7",
      name: "Breathing Pace Trainer",
      type: "Medical",
      description:
        "Students analyse breathing patterns at rest and after exercise.",
    },
  ];

  const collectionRef = db.collection("activities");

  activityData.forEach((item) => {
    const { id, ...data } = item;
    const docRef = collectionRef.doc(id);
    batch.set(docRef, {
      ...data,
      imageUrl: "header.png",
      updatedAt: new Date(),
    });
  });

  try {
    await batch.commit();
    console.log(`Successfully batched ${activityData.length} documents!`);
    process.exit();
  } catch (error) {
    console.error("Batch write failed: ", error);
    process.exit(1);
  }
};

seedWithBatch();
