import React from 'react';
import PropTypes from 'prop-types';

const Input = ({ className, type, value, ...other }) => (
  <input
    className={className}
    type={type}
    value={value}
    // TODO: review callback
    onClick={e =>
      (other.toggle ? other.toggle(other.onClick, e) : other.onClick(e))
    }
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
