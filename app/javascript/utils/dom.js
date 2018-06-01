import ReactDOM from 'react-dom';

export const isParent = (node, parents) => {
  const possibleParent = ReactDOM.findDOMNode(node);
  const haveParent = parents.filter(el => el === possibleParent);
  return haveParent.length !== 0;
};
