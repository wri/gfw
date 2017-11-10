import React from 'react';
import PropTypes from 'prop-types';

const ButtonRegular = props => {
  const { text, color, clickFunction } = props;
  return (
    <div
      className={`c-regular-button -${color}`}
      onClick={clickFunction}
      role="button"
      tabIndex="0"
    >
      {text}
    </div>
  );
};

ButtonRegular.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  clickFunction: PropTypes.string
};

export default ButtonRegular;
