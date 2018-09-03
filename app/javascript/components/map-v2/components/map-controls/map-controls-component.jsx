import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import { Tooltip } from 'react-tippy';
import { format } from 'd3-format';
import { connect } from 'react-redux';
import cx from 'classnames';
import { isParent } from 'utils/dom';

import Basemaps from 'components/map-v2/components/basemaps';
import RecentImagery from 'components/map-v2/components/recent-imagery';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import shareIcon from 'assets/icons/share.svg';
import fullscreenIcon from 'assets/icons/fit-zoom.svg';
import printIcon from 'assets/icons/print.svg';
import globeIcon from 'assets/icons/globe.svg';
import satelliteIcon from 'assets/icons/satellite.svg';

import './map-controls-styles.scss';

class MapControlsButtons extends PureComponent {
  state = {
    showBasemaps: false,
    showRecentImagery: false
  };

  onBasemapsRequestClose = () => {
    const isTargetOnTooltip = isParent(this.basemapsRef, this.basemapsRef.evt);
    this.basemapsRef.clearEvt();
    if (!isTargetOnTooltip && this.state.showBasemaps) {
      this.toggleBasemaps();
    }
  };

  onRecentRequestClose = () => {
    const isTargetOnTooltip = isParent(this.recentImageryRef, this.recentImageryRef.evt);
    this.recentImageryRef.clearEvt();
    if (!isTargetOnTooltip && this.state.showRecentImagery) {
      this.handleToggleRecentTooltip(false);
    }
  };

  toggleBasemaps = () =>
    this.setState(state => ({ showBasemaps: !state.showBasemaps }));

  handleToggleRecentImagery = () => {
    const { toogleRecentImagery, recentImageryActive } = this.props;
    if (!recentImageryActive) {
      this.handleToggleRecentTooltip(true);
    }
    toogleRecentImagery();
  }

  handleToggleRecentTooltip = show => {
    this.setState({ showRecentImagery: show });
  }

  setBasemapsRef = ref => {
    this.basemapsRef = ref;
  };

  setRecentImageryRef = ref => {
    this.recentImageryRef = ref;
  };

  render() {
    const {
      className,
      stickyOptions,
      setShareModal,
      settings,
      map,
      setMapSettings,
      setMenuSettings,
      recentImageryActive
    } = this.props;
    const { zoom, minZoom, maxZoom, center, hidePanels } = settings || {};
    const { showBasemaps, showRecentImagery } = this.state;

    return (
      <div className={`c-map-controls ${className || ''}`}>
        <Sticky enabled={false} {...stickyOptions}>
          {!hidePanels && (
            <div className="map-actions">
              <Tooltip
                theme="light"
                position="top-end"
                useContext
                interactive
                animateFill={false}
                open={showRecentImagery}
                onRequestClose={this.onRecentRequestClose}
                html={
                  <RecentImagery
                    onClose={() => this.handleToggleRecentTooltip(false)}
                    ref={this.setRecentImageryRef}
                  />
                }
                offset={100}
              >
                <Button
                  className="recent-imagery-btn"
                  theme="theme-button-map-control"
                  onClick={this.handleToggleRecentImagery}
                  tooltip={
                    !showRecentImagery
                      ? { text: !recentImageryActive ? 'Activate Recent Imagery' : 'Turn off Recent Imagery', hideOnClick: false }
                      : undefined
                  }
                >
                  <Icon
                    icon={satelliteIcon}
                    className={cx('satellite-icon', { '-active': recentImageryActive })}
                  />
                </Button>
              </Tooltip>
              <Tooltip
                theme="light"
                position="top-end"
                useContext
                interactive
                animateFill={false}
                open={showBasemaps}
                onRequestClose={this.onBasemapsRequestClose}
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
          )}
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
                setMapSettings({ hidePanels: !hidePanels });
                setMenuSettings({ selectedSection: '' });
              }}
              tooltip={{ text: hidePanels ? 'Show panels' : 'Show map only' }}
            >
              <Icon
                icon={fullscreenIcon}
                className={cx('fullscreen-icon', { '-active': hidePanels })}
              />
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
              tooltip={{ text: 'Print (not yet available)' }}
              disabled
            >
              <Icon icon={printIcon} className="print-icon" />
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
  className: PropTypes.string,
  setMapSettings: PropTypes.func,
  stickyOptions: PropTypes.object,
  setShareModal: PropTypes.func,
  settings: PropTypes.object,
  map: PropTypes.object,
  active: PropTypes.bool,
  hidePanels: PropTypes.bool,
  toogleRecentImagery: PropTypes.func,
  setMenuSettings: PropTypes.func,
  recentImageryActive: PropTypes.bool
};

export default connect()(MapControlsButtons);
