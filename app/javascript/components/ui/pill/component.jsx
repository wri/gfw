import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import { isTouch } from 'utils/browser';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import Icon from 'components/ui/icon';

import closeIcon from 'assets/icons/close.svg';
import './styles.scss';

const Button = props => {
  const {
    link,
    children,
    className,
    theme,
    disabled,
    active,
    onClick,
    tooltip
  } = props;
  const classNames = `c-pill ${theme || ''} ${className || ''} ${
    disabled ? 'disabled' : ''
  } ${active ? '--active' : ''}`;
  const isDeviceTouch = isTouch();

  const pill = (
    <Link
      className={classNames}
      to={link}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <Icon icon={closeIcon} />
    </Link>
  );

  if (tooltip) {
    return (
      <Tooltip
        theme="tip"
        position="top"
        arrow
        disabled={isDeviceTouch}
        html={<Tip text={tooltip.text} />}
        hideOnClick
        {...tooltip}
      >
        {pill}
      </Tooltip>
    );
  }
  return pill;
};

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  link: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  theme: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  extLink: PropTypes.string,
  tooltip: PropTypes.object,
  trackingData: PropTypes.object,
  buttonClicked: PropTypes.func
};

export default Button;
