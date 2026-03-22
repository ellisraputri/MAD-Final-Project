export const studentModel = ({
  id,
  email,
  firstName,
  grade,
  appearance = true,
  teamId = null,
}) => {
  return {
    id: id, 
    email: email,
    firstName: firstName,
    grade: grade,
    appearance: appearance,
    teamId: teamId,
  };
};