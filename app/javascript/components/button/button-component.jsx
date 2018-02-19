import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';

import { Tooltip } from 'react-tippy';

import './button-styles.scss';
import 'styles/themes/button/button-light.scss'; // eslint-disable-line
import 'styles/themes/button/button-small.scss'; // eslint-disable-line
import 'styles/themes/button/button-grey.scss'; // eslint-disable-line

const Button = props => {
  const {
    extLink,
    link,
    children,
    className,
    theme,
    disabled,
    onClick,
    tooltip,
    trackingData,
    buttonClicked
  } = props;
  const classNames = `c-button ${theme || ''} ${className || ''} ${
    disabled ? 'disabled' : ''
  }`;
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    if (trackingData) {
      buttonClicked(trackingData);
    }
  };
  let button = null;
  if (extLink) {
    button = (
      <a
        className={classNames}
        href={extLink}
        target="_blank"
        rel="noopener"
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </a>
    );
  } else if (link) {
    button = (
      <Link
        className={classNames}
        to={link}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  } else {
    button = (
      <button className={classNames} onClick={handleClick} disabled={disabled}>
        {children}
      </button>
    );
  }

  if (tooltip) {
    return <Tooltip {...tooltip}>{button}</Tooltip>;
  }
  return button;
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  theme: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  extLink: PropTypes.string,
  tooltip: PropTypes.object,
  trackingData: PropTypes.object,
  buttonClicked: PropTypes.func
};

export default Button;
