export const teamModel = ({
  id,
  name,
  grade,
  logo = null,
}) => {
  return {
    id: id,
    name: name,
    grade: grade,
    logo: logo,
  };
};