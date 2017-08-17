import React from 'react';
import PropTypes from 'prop-types';

const ButtonRegular= (props) => {
  const {text, color} = props
  return (
    <div className={`c-regular-button -${color}`}>
      {text}
    </div>
  );
};

export default ButtonRegular;
