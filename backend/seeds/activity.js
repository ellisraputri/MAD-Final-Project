import { db } from "../config/firestore.js";


const seedWithBatch = async () => {
  const batch = db.batch();
  const activityData = [
    { id: '1', name: 'Parachute Drop Challenge', type: 'Engineering'},
    { id: '2', name: 'Sound Pollution Hunter', type: 'Engineering'},
    { id: '3', name: 'Hand Fan Challenge', type: 'Engineering'},
    { id: '4', name: 'Earthquake-Resistant Structure', type: 'Engineering'},
    { id: '5', name: 'Human Performance Lab', type: 'Medical'},
    { id: '6', name: 'Reaction Board Challenge', type: 'Medical'},
    { id: '7', name: 'Breathing Pace Trainer', type: 'Medical'},
  ];

  const collectionRef = db.collection('activities');

  activityData.forEach((item) => {
    const { id, ...data } = item;
    const docRef = collectionRef.doc(id);
    batch.set(docRef, {
      ...data,
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