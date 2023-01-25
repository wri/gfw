import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const Icon = ({ icon, className, style }) => (
  <svg
    className={`c-icon ${className}`}
    viewBox={icon.viewBox || '0 0 32 32'}
    style={style}
  >
    <use xlinkHref={`#${icon.id || icon}`} />
  </svg>
);

Icon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
};

Icon.defaultProps = {
  className: '',
};

export default Icon;
