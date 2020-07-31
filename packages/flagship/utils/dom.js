import ReactDOM from 'react-dom';

export const isParent = (node, target) => {
  if (!target) return false;
  const parent = ReactDOM.findDOMNode(node);
  const hasParent = parent.contains(target);
  return !hasParent;
};
