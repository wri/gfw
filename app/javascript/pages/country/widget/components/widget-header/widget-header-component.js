import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Button from 'components/button';

import './widget-header-styles.scss';

class WidgetHeader extends PureComponent {
  render() {
    const {
      children,
      title,
      viewOnMapCallback,
      openShare,
      shareAnchor,
      size
    } = this.props;

    return (
      <div className="c-widget-header">
        <div className="title">{title}</div>
        <div className={`options size-${size}`}>
          <div className="small-options">
            <Button className="theme-button-small square" disabled>
              <svg className="icon icon-info">
                <use xlinkHref="#icon-info" />
              </svg>
            </Button>
            {children &&
              children.props.type === 'settings' && (
                <Tooltip
                  theme="light"
                  position="bottom-right"
                  offset={-95}
                  trigger="click"
                  interactive
                  arrow
                  html={children}
                >
                  <Button className="theme-button-small square">
                    <svg className="icon icon-settings">
                      <use xlinkHref="#icon-settings" />
                    </svg>
                  </Button>
                </Tooltip>
              )}
            <Button
              className="theme-button-small theme-button-light square"
              onClick={() => openShare(shareAnchor)}
            >
              <svg className="icon icon-share -dark">
                <use xlinkHref="#icon-share" />
              </svg>
            </Button>
          </div>
          {viewOnMapCallback && (
            <Button
              className="theme-button-small"
              onClick={viewOnMapCallback}
              disabled
            >
              VIEW ON MAP
            </Button>
          )}
        </div>
      </div>
    );
  }
}

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  openShare: PropTypes.func.isRequired,
  shareAnchor: PropTypes.string,
  viewOnMapCallback: PropTypes.func,
  children: PropTypes.object,
  size: PropTypes.number
};

export default WidgetHeader;
