import React from 'react';
import PropTypes from 'prop-types';

import './button-regular-styles.scss';

const ButtonRegular = props => {
  const { text, link, blank, color, className, clickFunction } = props;
  if (link) {
    return (
      <a
        href={link}
        target={blank ? '__blank' : ''}
        className={'c-regular-button -green'}
      >
        {text}
      </a>
    );
  }
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
  link: PropTypes.string,
  color: PropTypes.string,
  blank: PropTypes.bool,
  className: PropTypes.string,
  clickFunction: PropTypes.func
};

ButtonRegular.defaultProps = {
  className: '',
  clickFunction: () => {}
};

export default ButtonRegular;
