import React from 'react';
import PropTypes from 'prop-types';

import './icon-styles.scss';

const Icon = ({ icon }) => (
  <svg className="c-icon" viewBox={icon.viewBox}>
    <use xlinkHref={`#${icon.id}`} />
  </svg>
);

Icon.propTypes = {
  icon: PropTypes.object
};

export default Icon;
