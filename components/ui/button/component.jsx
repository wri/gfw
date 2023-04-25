import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import cx from 'classnames';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import { trackEvent } from 'utils/analytics';

const Button = (props) => {
  const {
    id = 'button',
    extLink,
    link,
    children,
    className,
    theme,
    disabled,
    active,
    onClick,
    tooltip,
    background,
    trackingData,
    target,
    tooltipPosition = 'top',
  } = props;

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (trackingData) {
      const { event, label } = trackingData;
      trackEvent(event, { label });
    }
  };

  let button = null;
  if (extLink) {
    button = (
      <a
        data-id={id}
        id={id}
        className={cx(
          'c-button',
          theme,
          className,
          { disabled },
          { '--active': active }
        )}
        href={extLink}
        target={target || '_blank'}
        rel="noopener"
        onClick={handleClick}
        disabled={disabled}
      >
        {children}
      </a>
    );
  } else if (link) {
    button = (
      <Link href={link}>
        <a>
          <button
            data-id={id}
            id={id}
            className={cx(
              'c-button',
              theme,
              className,
              { disabled },
              { '--active': active }
            )}
            disabled={disabled}
            onClick={handleClick}
          >
            {children}
          </button>
        </a>
      </Link>
    );
  } else {
    button = (
      <button
        data-id={id}
        id={id}
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
        position={tooltipPosition}
        arrow
        touchHold
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
  id: PropTypes.string,
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
  background: PropTypes.string,
  target: PropTypes.string,
  tooltipPosition: PropTypes.string,
};

export default Button;
