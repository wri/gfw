import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Button from 'components/button';
import Icon from 'components/icon';

import settingsIcon from 'assets/icons/settings.svg';
import shareIcon from 'assets/icons/share.svg';
import infoIcon from 'assets/icons/info.svg';
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
              <Icon icon={infoIcon} />
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
                    <Icon icon={settingsIcon} className="settings-icon" />
                  </Button>
                </Tooltip>
              )}
            <Button
              className="theme-button-small theme-button-light square"
              onClick={() => openShare(shareAnchor)}
            >
              <Icon icon={shareIcon} />
            </Button>
          </div>
          {viewOnMapCallback && (
            <Button
              className="theme-button-small view-on-map"
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
