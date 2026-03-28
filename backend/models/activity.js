export const activityModel = ({
  id,
  name,
  type,
  imageUrl,
  description,
}) => {
  return {
    id: id,
    name: name,
    type: type,
    imageUrl: imageUrl,
    description: description,
  };
};