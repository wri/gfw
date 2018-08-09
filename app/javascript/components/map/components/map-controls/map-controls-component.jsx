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
import globeIcon from 'assets/icons/globe.svg';
import satelliteIcon from 'assets/icons/satellite.svg';

import './map-controls-styles.scss';

class MapControlsButtons extends PureComponent {
  render() {
    const {
      className,
      stickyOptions,
      setShareModal,
      share,
      settings,
      map,
      isTimelineOpen,
      active,
      toogleRecentImagery
    } = this.props;

    return (
      <div className={`c-map-controls ${className || ''}`}>
        <Sticky enabled={false} {...stickyOptions}>
          <div className="map-actions">
            <Button
              className="recent-imagery-btn"
              theme="theme-button-map-control"
              active={active}
              onClick={() => toogleRecentImagery()}
              tooltip={{ text: 'Recent Imagery' }}
            >
              <Icon icon={satelliteIcon} className="satellite-icon" />
            </Button>
            <Button
              className="basemaps-btn"
              theme="theme-button-map-control"
              tooltip={{ text: 'Basemaps' }}
            >
              <Icon icon={globeIcon} className="globe-icon" />
            </Button>
          </div>
          <div className="controls-wrapper">
            <Button
              theme="theme-button-map-control"
              onClick={() => map.setZoom(settings.zoom + 1)}
              tooltip={{ text: 'Zoom in' }}
              disabled={settings.zoom === settings.maxZoom}
            >
              <Icon icon={plusIcon} className="plus-icon" />
            </Button>
            <Button
              theme="theme-button-map-control"
              onClick={() => map.setZoom(settings.zoom - 1)}
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

MapControlsButtons.propTypes = {
  className: Proptypes.string,
  setMapSettings: Proptypes.func,
  stickyOptions: Proptypes.object,
  setShareModal: Proptypes.func,
  share: Proptypes.bool,
  settings: Proptypes.object,
  map: Proptypes.object
};

export default MapControlsButtons;
