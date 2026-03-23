export const studentModel = ({
  email,
  firstName,
  grade,
  appearance = true,
  teamId = null,
}) => {
  return {
    email: email,
    firstName: firstName,
    grade: grade,
    appearance: appearance,
    teamId: teamId,
  };
};