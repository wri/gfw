import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';

import './styles.scss';
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

class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    theme: PropTypes.string,
    disabled: PropTypes.bool,
    active: PropTypes.bool,
    onClick: PropTypes.func,
    tooltip: PropTypes.object,
    ariaLabel: PropTypes.string
  };

  renderButton = () => {
    const {
      children,
      className,
      theme,
      disabled,
      active,
      onClick,
      ariaLabel
    } = this.props;

    return (
      <button
        className={cx(
          'c-button',
          theme,
          className,
          { disabled },
          { 'active': active }
        )}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
      >
        {/* Fixes Safari 10 flexbox issues with button elements */}
        <div className="button-wrapper">
          {children}
        </div>
      </button>
    );
  }

  render() {
    const { tooltip } = this.props;

    return tooltip ? (
      <Tooltip
        theme="tip"
        position="top"
        arrow
        html={<Tip text={tooltip.text} />}
        hideOnClick
        {...tooltip}
      >
        {this.renderButton()}
      </Tooltip>
    ) :
      this.renderButton()
  }
}

export default Button;
