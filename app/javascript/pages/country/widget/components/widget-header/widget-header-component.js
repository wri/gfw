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
      openShare,
      shareAnchor,
      settingsConfig,
      locationNames,
      widget
    } = this.props;

    return (
      <div className="c-widget-header" id={shareAnchor}>
        <div className="title">{`${title} in ${
          locationNames.current ? locationNames.current.label : ''
        }`}</div>
        <div className="options">
          <div className="small-options">
            <Button className="theme-button-small square" disabled>
              <Icon icon={infoIcon} />
            </Button>
            {settingsConfig &&
              settingsConfig.options && (
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
                      widget={widget}
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
              onClick={openShare}
            >
              <Icon icon={shareIcon} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

WidgetHeader.propTypes = {
  title: PropTypes.string.isRequired,
  openShare: PropTypes.func.isRequired,
  shareAnchor: PropTypes.string,
  widget: PropTypes.string,
  settingsConfig: PropTypes.object,
  locationNames: PropTypes.object
};

export default WidgetHeader;
