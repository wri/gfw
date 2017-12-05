import React from 'react';
import PropTypes from 'prop-types';

import './button-regular-styles.scss';

const ButtonRegular = props => {
  const {
    text,
    link,
    blank,
    color,
    className,
    clickFunction,
    disabled
  } = props;
  if (link) {
    return (
      <a
        href={link}
        target={blank ? '__blank' : ''}
        className={`c-regular-button -green ${disabled && '-disabled'}`}
      >
        {text}
      </a>
    );
  }
  return (
    <button
      className={`c-regular-button -${color} ${className} ${disabled &&
        '-disabled'}`}
      onClick={clickFunction}
    >
      {text}
    </button>
  );
};

ButtonRegular.propTypes = {
  text: PropTypes.string,
  link: PropTypes.string,
  color: PropTypes.string,
  blank: PropTypes.bool,
  className: PropTypes.string,
  clickFunction: PropTypes.func,
  disabled: PropTypes.bool
};

ButtonRegular.defaultProps = {
  className: '',
  clickFunction: () => {}
};

export default ButtonRegular;
