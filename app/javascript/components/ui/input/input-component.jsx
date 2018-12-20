import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ className, type, value, ...other }) => (
  <input
    className={className}
    type={type}
    value={value}
    {...other}
    readOnly="readonly"
  />
);

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string
};

Input.defaultProps = {
  className: '',
  type: 'text',
  value: ''
};

export default Input;
