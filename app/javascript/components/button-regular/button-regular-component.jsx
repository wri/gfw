import React from 'react';
import PropTypes from 'prop-types';

import './button-regular-styles.scss';

const ButtonRegular = props => {
  const { text, color, className, clickFunction } = props;
  return (
    <button
      className={`c-regular-button -${color} ${className}`}
      onClick={clickFunction}
    >
      {text}
    </button>
  );
};

ButtonRegular.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  clickFunction: PropTypes.func
};

ButtonRegular.defaultProps = {
  className: '',
  clickFunction: () => {}
};

export default ButtonRegular;
