import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import Button from 'components/button';
import Icon from 'components/icon';
import isEmpty from 'lodash/isEmpty';

import WidgetSettings from 'pages/country/widget/components/widget-settings';
import settingsIcon from 'assets/icons/settings.svg';
import shareIcon from 'assets/icons/share.svg';
import infoIcon from 'assets/icons/info.svg';
import './widget-header-styles.scss';

class WidgetHeader extends PureComponent {
  constructor() {
    super();
    this.state = {
      tooltipOpen: false
    };
  }

  render() {
    const {
      title,
      settingsConfig,
      locationNames,
      widget,
      embed,
      shareData,
      setShareModal,
      setModalMeta,
      modalOpen,
      modalClosing
    } = this.props;
    const { tooltipOpen } = this.state;

    return (
      <div className="c-widget-header">
        <div className="title">{`${title} in ${
          locationNames.current ? locationNames.current.label : ''
        }`}</div>
        <div className="options">
          <div className="small-options">
            <Button
              className="theme-button-small square"
              onClick={() =>
                setModalMeta(
                  settingsConfig.config.metaKey,
                  ['title', 'citation'],
                  ['function', 'source']
                )
              }
            >
              <Icon icon={infoIcon} />
            </Button>
            {!embed &&
              settingsConfig &&
              !isEmpty(settingsConfig.options) && (
                <Tooltip
                  theme="light"
                  position="bottom-right"
                  offset={-95}
                  trigger="click"
                  interactive
                  onRequestClose={() => {
                    if (!modalClosing && !modalOpen) {
                      this.setState({ tooltipOpen: false });
                    }
                  }}
                  onShow={() => this.setState({ tooltipOpen: true })}
                  arrow
                  useContext
                  open={tooltipOpen}
                  html={
                    <WidgetSettings
                      {...settingsConfig}
                      widget={widget}
                      locationNames={locationNames}
                      setModalMeta={setModalMeta}
                    />
                  }
                >
                  <Button className="theme-button-small square">
                    <Icon icon={settingsIcon} className="settings-icon" />
                  </Button>
                </Tooltip>
              )}
            <Button
              className="theme-button-small theme-button-grey square"
              onClick={() => setShareModal(shareData)}
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
  widget: PropTypes.string,
  title: PropTypes.string.isRequired,
  settingsConfig: PropTypes.object,
  locationNames: PropTypes.object,
  embed: PropTypes.bool,
  setShareModal: PropTypes.func.isRequired,
  shareData: PropTypes.object.isRequired,
  setModalMeta: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool,
  modalClosing: PropTypes.bool
};

export default WidgetHeader;
