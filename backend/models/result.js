export const resultModel = ({
  activityId,
  teamId,
  attemptNo,
  score,
  medias,
  predictions,
  ratings = null, 
  comments = null
}) => {
  return {
    activityId: activityId,
    teamId: teamId,
    attemptNo: attemptNo,
    score: score,
    medias: medias,
    predictions: predictions,
    ratings: ratings,
    comments: comments,
    timestamp: new Date()
  };
};