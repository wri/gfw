import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Button from 'components/button';
import Icon from 'components/icon';

import WidgetSettings from 'pages/country/widget/components/widget-settings';
import settingsIcon from 'assets/icons/settings.svg';
import shareIcon from 'assets/icons/share.svg';
import infoIcon from 'assets/icons/info.svg';
import './widget-header-styles.scss';

class WidgetHeader extends PureComponent {
  render() {
    const {
      title,
      viewOnMapCallback,
      openShare,
      shareAnchor,
      size,
      settingsConfig,
      locationNames
    } = this.props;

    return (
      <div className="c-widget-header">
        <div className="title">{`${title} in ${locationNames.current &&
          locationNames.current.label}`}</div>
        <div className={`options size-${size}`}>
          <div className="small-options">
            <Button className="theme-button-small square" disabled>
              <Icon icon={infoIcon} />
            </Button>
            {settingsConfig.options &&
              settingsConfig.actions && (
                <Tooltip
                  theme="light"
                  position="bottom-right"
                  offset={-95}
                  trigger="click"
                  interactive
                  arrow
                  useContext
                  html={
                    <WidgetSettings
                      {...settingsConfig}
                      locationNames={locationNames}
                    />
                  }
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
  size: PropTypes.number,
  settingsConfig: PropTypes.object,
  locationNames: PropTypes.object
};

export default WidgetHeader;
