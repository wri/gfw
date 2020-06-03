import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({ className, type, value, ...other }, ref) => (
  <input
    ref={ref}
    className={className}
    type={type}
    value={value}
    {...other}
    readOnly="readonly"
  />
));

Input.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

Input.defaultProps = {
  className: '',
  type: 'text',
  value: '',
};

export default Input;
