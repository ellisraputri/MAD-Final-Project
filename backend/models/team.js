export const teamModel = ({ name, grade, logo = null }) => {
  return {
    name: name,
    grade: grade,
    logo: logo,
  };
};
