import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import Sticky from 'react-stickynode';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import shareIcon from 'assets/icons/share.svg';
import fullScreenIcon from 'assets/icons/fit-zoom.svg';
import printIcon from 'assets/icons/print.svg';
import './map-controls-styles.scss';

class MapControls extends PureComponent {
  render() {
    const {
      setMapSettings,
      className,
      stickyOptions,
      setShareModal,
      share,
      settings
    } = this.props;

    return (
      <div className={`c-map-controls ${className || ''}`}>
        <Sticky enabled={false} {...stickyOptions}>
          <div className="controls-wrapper">
            <Button
              theme="theme-button-map-control"
              onClick={() => setMapSettings({ zoom: settings.zoom + 1 })}
              tooltip={{ text: 'Zoom in' }}
              disabled={settings.zoom === settings.maxZoom}
            >
              <Icon icon={plusIcon} className="plus-icon" />
            </Button>
            <Button
              theme="theme-button-map-control"
              onClick={() => setMapSettings({ zoom: settings.zoom - 1 })}
              tooltip={{ text: 'Zoom out' }}
              disabled={settings.zoom === settings.minZoom}
            >
              <Icon icon={minusIcon} className="minus-icon" />
            </Button>
            <Button
              theme="theme-button-map-control"
              onClick={() => {
                console.info('fullscreen time!');
              }}
              tooltip={{ text: 'Fullscreen' }}
            >
              <Icon icon={fullScreenIcon} className="fullscreen-icon" />
            </Button>
            {share && (
              <Button
                className="theme-button-map-control"
                onClick={() =>
                  setShareModal({
                    title: 'Share this view',
                    shareUrl: window.location.href,
                    embedUrl: window.location.href,
                    embedSettings: {
                      width: 670,
                      height: 490
                    }
                  })
                }
                tooltip={{ text: 'Share or embed this view' }}
              >
                <Icon icon={shareIcon} />
              </Button>
            )}
            <Button
              theme="theme-button-map-control"
              onClick={() => {
                console.info('Printing time!');
              }}
              tooltip={{ text: 'Print' }}
            >
              <Icon icon={printIcon} className="fullscreen-icon" />
            </Button>
          </div>
        </Sticky>
      </div>
    );
  }
}

MapControls.propTypes = {
  className: Proptypes.string,
  setMapSettings: Proptypes.func,
  stickyOptions: Proptypes.object,
  setShareModal: Proptypes.func,
  share: Proptypes.bool,
  settings: Proptypes.object
};

export default MapControls;
