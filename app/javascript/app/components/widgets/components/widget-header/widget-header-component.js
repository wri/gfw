import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import isEmpty from 'lodash/isEmpty';
import { COUNTRY } from 'router';
import { isParent } from 'utils/dom';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Tip from 'components/ui/tip';
import WidgetSettings from 'components/widgets/components/widget-settings';

import settingsIcon from 'assets/icons/settings.svg';
import shareIcon from 'assets/icons/share.svg';
import infoIcon from 'assets/icons/info.svg';
import mapIcon from 'assets/icons/map-button.svg';
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
      settings,
      options,
      currentLabel,
      modalClosing,
      widget,
      location,
      query,
      embed,
      minimalist,
      shareData,
      setShareModal,
      setModalMeta,
      setShowMapMobile,
      citation,
      active,
      haveMapLayers,
      isDeviceTouch,
      size,
      widgetMetaKey
    } = this.props;
    const { tooltipOpen } = this.state;

    return (
      <div className="c-widget-header">
        <div className="title">{title}</div>
        <div className="options">
          {!embed &&
            !minimalist &&
            haveMapLayers && (
              <Button
                className={`map-button ${active ? '-active' : ''}`}
                theme={`theme-button-small ${
                  size === 'small' || isDeviceTouch ? 'square' : ''
                }`}
                link={{
                  type: COUNTRY,
                  payload: { ...location },
                  query: {
                    ...query,
                    widget
                  }
                }}
                trackingData={{
                  title: 'map-button',
                  widget: `${title} in ${currentLabel || ''}`
                }}
                onClick={() => setShowMapMobile(true)}
                tooltip={
                  size === 'small'
                    ? {
                      theme: 'tip',
                      position: 'top',
                      arrow: true,
                      disabled: isDeviceTouch,
                      html: (
                        <Tip
                          text={
                            active ? 'Currently displayed' : 'Show on map'
                          }
                        />
                      )
                    }
                    : null
                }
              >
                {(size === 'small' || isDeviceTouch) && (
                  <Icon icon={mapIcon} className="map-icon" />
                )}
                {size !== 'small' && !isDeviceTouch && 'SHOW ON MAP'}
              </Button>
            )}
          {settings &&
            !minimalist &&
            !isEmpty(options) && (
              <Tooltip
                className="widget-tooltip-theme"
                theme="light"
                position="bottom-right"
                offset={-95}
                trigger="click"
                interactive
                onRequestClose={() => {
                  const isTargetOnTooltip = isParent(
                    this.widgetSettingsRef,
                    this.widgetSettingsRef.evt
                  );
                  this.widgetSettingsRef.clearEvt();

                  if (!modalClosing && !isTargetOnTooltip) {
                    this.setState({ tooltipOpen: false });
                  }
                }}
                onShow={() => this.setState({ tooltipOpen: true })}
                arrow
                useContext
                open={tooltipOpen}
                html={
                  <WidgetSettings
                    ref={node => {
                      this.widgetSettingsRef = node;
                    }}
                    {...this.props}
                  />
                }
              >
                <Button
                  className="theme-button-small square"
                  tooltip={{
                    theme: 'tip',
                    position: 'top',
                    arrow: true,
                    disabled: isDeviceTouch,
                    html: <Tip text="Filter and customize the data" />
                  }}
                  trackingData={{
                    event: 'open-settings',
                    label: `${title} in ${currentLabel || ''}`
                  }}
                >
                  <Icon icon={settingsIcon} className="settings-icon" />
                </Button>
              </Tooltip>
            )}
          {!embed &&
            !minimalist &&
            (!isEmpty(options) || haveMapLayers) && (
              <div className="separator" />
            )}
          <div className="small-options">
            <Button
              className="theme-button-small square"
              onClick={() =>
                setModalMeta(
                  widgetMetaKey,
                  ['title', 'citation'],
                  ['function', 'source'],
                  citation
                )
              }
              tooltip={{
                theme: 'tip',
                position: 'top',
                arrow: true,
                disabled: isDeviceTouch,
                html: <Tip text="Learn more about the data" />
              }}
            >
              <Icon icon={infoIcon} />
            </Button>
            {!minimalist && (
              <Button
                className="theme-button-small square"
                onClick={() => setShareModal(shareData)}
                tooltip={{
                  theme: 'tip',
                  position: 'top',
                  arrow: true,
                  disabled: isDeviceTouch,
                  html: <Tip text="Share or embed this widget" />
                }}
              >
                <Icon icon={shareIcon} />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}

WidgetHeader.propTypes = {
  widget: PropTypes.string,
  title: PropTypes.string.isRequired,
  settings: PropTypes.object,
  options: PropTypes.object,
  currentLabel: PropTypes.string,
  location: PropTypes.object,
  query: PropTypes.object,
  embed: PropTypes.bool,
  minimalist: PropTypes.bool,
  haveMapLayers: PropTypes.bool,
  isDeviceTouch: PropTypes.bool,
  size: PropTypes.string,
  widgetMetaKey: PropTypes.string,
  setShareModal: PropTypes.func.isRequired,
  shareData: PropTypes.object.isRequired,
  setModalMeta: PropTypes.func.isRequired,
  setShowMapMobile: PropTypes.func,
  modalOpen: PropTypes.bool,
  modalClosing: PropTypes.bool,
  active: PropTypes.bool,
  citation: PropTypes.string
};

export default WidgetHeader;
