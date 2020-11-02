import { findDOMNode } from 'react-dom';

export const isParent = (node, target) => {
  if (!target) return false;
  // eslint-disable-next-line react/no-find-dom-node
  const parent = findDOMNode(node);
  const hasParent = parent.contains(target);
  return !hasParent;
};
