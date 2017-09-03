import React from 'react';
import PropTypes from 'prop-types';

const ButtonRegular= (props) => {
  const {text, color, clickFunction} = props
  return (
    <div className={`c-regular-button -${color}`} onClick={clickFunction}>
      {text}
    </div>
  );
};

export default ButtonRegular;
