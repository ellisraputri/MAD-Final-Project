export const resultModel = ({
  activityId,
  teamId,
  attemptNo,
  score,
  outcomes,
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
    outcomes: outcomes,
    medias: medias,
    predictions: predictions,
    ratings: ratings,
    comments: comments,
    timestamp: new Date()
  };
};