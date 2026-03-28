import { db } from '../config/firestore.js';

const dummyPredictions = {
  '1':  [{'mass': 800, 'time': 2.31}, {'mass': 800, 'time': 2.31}, {'mass': 800, 'time': 2.31}],
  '2':  [{'order': 1}, {'order': 3}, {'order': 2}],
  '3':  [{'bend': 100}, {'bend': 30.99}, {'bend': 22.09}],
  '4':  [{'movement': 0.99}, {'movement': 3.12}, {'movement': 1.78}],
  '5':  [{'vibration': 5.12}, {'vibration': 3.99}, {'vibration': 2.09}],
  '6':  [{'delay': 8.79}, {'delay': 9.01}, {'delay': 5.09}],
  '7':  [{'breathe_per_minute': 12}, {'breathe_per_minute': 34}, {'breathe_per_minute': 43}],
}


const seedOnDemand = async () => {
  try {
    const [activitiesSnap, teamsSnap] = await Promise.all([
      db.collection('activities').get(),
      db.collection('teams').get()
    ]);

    const activityIds = activitiesSnap.docs.map(doc =>doc.id);
    const teamIds = teamsSnap.docs.map(doc => doc.id);
    const noNeedMedia = "6"; 

    let batch = db.batch();
    let count = 0;

    for (const teamId of teamIds) {
      const activityCount = Math.floor(Math.random() * 8);
      const selectedActivities = activityIds.sort(() => 0.5 - Math.random()).slice(0, activityCount);

      for (const activityId of selectedActivities) {
        const attempts = Math.floor(Math.random() * 2) + 1;

        for (let attemptNo = 1; attemptNo <= attempts; attemptNo++) {
          const resultRef = db.collection('results').doc();
          let assignedMediaIds = null;

          if (activityId !== noNeedMedia) {
            assignedMediaIds = [];
            const mediaCountPerResult = 3;

            let mediaType = 'audio'; //2,7
            let mediaExt = 'wav'; 

            if(activityId === '1' || activityId === '3'){
              mediaType = 'video'; //1,3
              mediaExt = 'mp4';
            }
            else if (activityId === '4' || activityId === '5'){
              mediaType = 'string'; //4,5
              mediaExt = 'seconds';
            }             

            for (let m = 0; m < mediaCountPerResult; m++) {
              const mediaRef = db.collection('medias').doc(); 
              assignedMediaIds.push(mediaRef.id);

              let mediaContent = '';

              if (activityId === '4' || activityId === '5'){
                mediaContent = `12 ${mediaExt}`
              } 
              else{
                mediaContent = `https://${mediaType}_activity${activityId}_${m}.${mediaExt}`;
              }

              batch.set(mediaRef, {
                type: mediaType,
                content: mediaContent,
                updatedAt: new Date()
              });
            }
          }

          const score = Math.random();

          batch.set(resultRef, {
            activityId,
            teamId,
            attemptNo,
            score: score,
            outcomes: [score/3, score/3, score/3],
            medias: assignedMediaIds, 
            predictions: dummyPredictions[activityId],
            ratings: Math.floor(Math.random() * 5) + 1,
            comments: `${count} Test test comment hehehhe`,
            timestamp: new Date()
          });

          count++;
          
          if (count % 100 === 0) {
            await batch.commit();
            batch = db.batch(); 
          }
        }
      }
    }

    await batch.commit();
    console.log(`Finished! Created ${count} results with on-demand media.`);
    process.exit(0);
  } 
  catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedOnDemand();

//good for testing (done all 7 activities):
//team ID prbsKC
//student mail student65@mail.com - student70@mail.com