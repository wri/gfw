import React from 'react';
import PropTypes from 'prop-types';
import Link from 'redux-first-router-link';
import { isTouch } from 'utils/browser';
import cx from 'classnames';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import './button-styles.scss';
import './themes/button-light.scss'; // eslint-disable-line
import './themes/button-small.scss'; // eslint-disable-line
import './themes/button-xsmall.scss'; // eslint-disable-line
import './themes/button-medium.scss'; // eslint-disable-line
import './themes/button-tiny.scss'; // eslint-disable-line
import './themes/button-grey.scss'; // eslint-disable-line
import './themes/button-grey-filled.scss'; // eslint-disable-line
import './themes/button-clear.scss'; // eslint-disable-line
import './themes/button-map-control.scss'; // eslint-disable-line
import './themes/button-dashed.scss'; // eslint-disable-line
import './themes/button-dark-round.scss'; // eslint-disable-line

const Button = props => {
  const {
    extLink,
    link,
    children,
    className,
    theme,
    disabled,
    active,
    onClick,
    tooltip,
    background
  } = props;
  const isDeviceTouch = isTouch();
  const handleClick = e => {
    if (onClick) {
      onClick(e);
    }
  };
  let button = null;
  if (extLink) {
    button = (
      <a
        className={cx(
          'c-button',
          theme,
          className,
          { disabled },
          { '--active': active }
        )}
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
        className={cx(
          'c-button',
          theme,
          className,
          { disabled },
          { '--active': active }
        )}
        to={link}
        disabled={disabled}
        onClick={handleClick}
      >
        {children}
      </Link>
    );
  } else {
    button = (
      <button
        className={cx(
          'c-button',
          theme,
          className,
          { disabled },
          { '--active': active }
        )}
        onClick={handleClick}
        disabled={disabled}
        style={background && { background }}
      >
        <div className="button-wrapper">{children}</div>
      </button>
    );
  }

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
        {button}
      </Tooltip>
    );
  }
  return button;
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
  buttonClicked: PropTypes.func,
  background: PropTypes.string
};

export default Button;
