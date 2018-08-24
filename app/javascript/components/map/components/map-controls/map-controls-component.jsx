import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import Sticky from 'react-stickynode';
import { Tooltip } from 'react-tippy';
import { format } from 'd3-format';
import { connect } from 'react-redux';
import cx from 'classnames';
import { isParent } from 'utils/dom';

import Basemaps from 'components/map/components/basemaps';
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
  state = {
    showBasemaps: false
  };

  onTooltipRequestClose = () => {
    const isTargetOnTooltip = isParent(this.basemapsRef, this.basemapsRef.evt);
    this.basemapsRef.clearEvt();
    if (!isTargetOnTooltip && this.state.showBasemaps) {
      this.toggleBasemaps();
    }
  };

  toggleBasemaps = () =>
    this.setState(state => ({ showBasemaps: !state.showBasemaps }));

  setBasemapsRef = ref => {
    this.basemapsRef = ref;
  };

  render() {
    const {
      className,
      stickyOptions,
      setShareModal,
      settings,
      map,
      active,
      toogleRecentImagery
    } = this.props;
    const { zoom, minZoom, maxZoom, center } = settings || {};
    const { showBasemaps } = this.state;

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
              disabled
            >
              <Icon icon={satelliteIcon} className="satellite-icon" />
            </Button>
            <Tooltip
              theme="light"
              position="top-end"
              useContext
              interactive
              animateFill={false}
              open={showBasemaps}
              onRequestClose={this.onTooltipRequestClose}
              html={
                <Basemaps
                  onClose={this.toggleBasemaps}
                  ref={this.setBasemapsRef}
                />
              }
            >
              <Button
                className="basemaps-btn"
                theme="theme-button-map-control"
                onClick={this.toggleBasemaps}
                tooltip={
                  !showBasemaps
                    ? { text: 'Basemaps', hideOnClick: false }
                    : undefined
                }
              >
                <Icon
                  icon={globeIcon}
                  className={cx('globe-icon', { '-active': showBasemaps })}
                />
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
            <span>{zoom}</span>
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
  settings: Proptypes.object,
  map: Proptypes.object,
  active: Proptypes.bool,
  toogleRecentImagery: Proptypes.func
};

export default connect()(MapControlsButtons);
