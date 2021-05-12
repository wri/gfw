import React from 'react';

import Emissions from 'assets/icons/widgets/carbon-flux/emissions.svg';
import Removals from 'assets/icons/widgets/carbon-flux/removals.svg';

import './styles.scss';

export const Component = () => (
  <div className="c-carbon-flux-image-component">
    <img className="image" src={Removals} alt="Removals" />
    <img className="image" src={Emissions} alt="Emissions" />
  </div>
);

export default Component;
