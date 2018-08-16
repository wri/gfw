import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import Sticky from 'react-stickynode';
import { Tooltip } from 'react-tippy';
import { format } from 'd3-format';
import { connect } from 'react-redux';

import Basemaps from 'components/map/components/basemaps';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import shareIcon from 'assets/icons/share.svg';
import fullScreenIcon from 'assets/icons/fit-zoom.svg';
import printIcon from 'assets/icons/print.svg';
import globeIcon from 'assets/icons/globe.svg';
import sateliteIcon from 'assets/icons/satellite.svg';

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
      active,
      toogleRecentImagery
    } = this.props;
    const { zoom, minZoom, maxZoom, center } = settings || {};

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
              <Icon icon={sateliteIcon} className="satelite-icon" />
            </Button>
            <Tooltip
              theme="light"
              position="top-end"
              trigger="click"
              useContext
              hideOnClick
              interactive
              html={<Basemaps />}
            >
              <Button
                className="basemaps-btn"
                theme="theme-button-map-control"
                tooltip={{ text: 'Basemaps', hideOnClick: false }}
              >
                <Icon icon={globeIcon} className="globe-icon" />
              </Button>
            </Tooltip>
          </div>
          <div className="controls-wrapper">
            <Button
              theme="theme-button-map-control"
              onClick={() => map.setZoom(zoom + 1)}
              tooltip={{ text: 'Zoom in' }}
              disabled={zoom === maxZoom}
            >
              <Icon icon={plusIcon} className="plus-icon" />
            </Button>
            <Button
              theme="theme-button-map-control"
              onClick={() => map.setZoom(zoom - 1)}
              tooltip={{ text: 'Zoom out' }}
              disabled={zoom === minZoom}
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
          <div className="map-position">
            <span>{settings.zoom}</span>
            <span>{`${format('.6f')(center.lat)}, ${format('.6f')(
              center.lng
            )}`}</span>
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
  map: Proptypes.object,
  active: Proptypes.bool,
  toogleRecentImagery: Proptypes.func
};

export default connect()(MapControlsButtons);
