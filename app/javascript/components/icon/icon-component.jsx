import React from 'react';
import PropTypes from 'prop-types';

import './icon-styles.scss';

const Icon = ({ icon, className }) => (
  <svg className={`c-icon ${className}`} viewBox={icon.viewBox}>
    <use xlinkHref={`#${icon.id}`} />
  </svg>
);

Icon.propTypes = {
  icon: PropTypes.object,
  className: PropTypes.string
};

Icon.defaultProps = {
  className: ''
};

export default Icon;
