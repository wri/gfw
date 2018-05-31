export const isMouseOnBounds = (event, bounds) => {
  const { x, y, width, height } = bounds;
  return (
    event.x >= x &&
    event.x <= x + width &&
    event.y >= y &&
    event.y <= y + height
  );
};

export const isParent = (possibleParent, parents) => {
  const haveParent = parents.filter(el => el === possibleParent);
  return haveParent.length !== 0;
};
