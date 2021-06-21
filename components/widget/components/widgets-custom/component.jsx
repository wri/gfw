import React from 'react';
import PropTypes from 'prop-types';

import CarbonFlux from './carbon-flux';

const CustomComponent = ({ type }) => {
  const customOptions = {
    CarbonFlux,
  };

  const Component = customOptions[type];

  return (
    <div className="c-custom-component">
      <Component />
    </div>
  );
};

CustomComponent.propTypes = {
  type: PropTypes.string,
};

export default CustomComponent;
