import React from 'react';
import PropTypes from 'prop-types';

import './icon-styles.scss';

const Icon = ({ icon, className, onClick }) => (
  <svg
    className={`c-icon ${className}`}
    viewBox={icon.viewBox || '0 0 32 32'}
    onClick={onClick}
  >
    <use xlinkHref={`#${icon.id || icon}`} />
  </svg>
);

Icon.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  className: PropTypes.string,
  onClick: PropTypes.func
};

Icon.defaultProps = {
  className: ''
};

export default Icon;
