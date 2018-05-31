export const isMouseOnBounds = (event, bounds) => {
  const { x, y, width, height } = bounds;
  return (
    (event.x - x) * (event.x - x + width) <= 0 &&
    (event.y - y) * (event.y - y + height) <= 0
  );
};

export const isParent = (possibleParent, parents) => {
  const haveParent = parents.filter(el => el === possibleParent);
  return haveParent.length !== 0;
};
