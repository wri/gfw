import React from 'react';

import Image1 from 'assets/icons/tree-success.png';

import './styles.scss';

export const Component = () => (
  <div className="c-carbon-flux-image-component">
    <img className="image" src={Image1} alt="success-tree" />
    <img className="image" src={Image1} alt="success-tree" />
  </div>
);

export default Component;
