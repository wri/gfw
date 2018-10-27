import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { format } from 'd3-format';
import { connect } from 'react-redux';
import cx from 'classnames';
import { isParent } from 'utils/dom';
import { track } from 'utils/analytics';

import Basemaps from 'components/map-v2/components/basemaps';
import RecentImagerySettings from 'components/map-v2/components/recent-imagery/components/recent-imagery-settings-tooltip';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import Loader from 'components/ui/loader';

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
    showBasemaps: false
  };

  handleHidePanels = () => {
    const {
      setMapSettings,
      setMenuSettings,
      setRecentImagerySettings,
      settings: { hidePanels }
    } = this.props;
    setMapSettings({ hidePanels: !hidePanels });
    setMenuSettings({ menuSection: '' });
    setRecentImagerySettings({
      visible: false
    });
    this.setState({ showBasemaps: false });
    if (!hidePanels) {
      track('hidePanels');
    }
  };

  onBasemapsRequestClose = () => {
    const isTargetOnTooltip = isParent(this.basemapsRef, this.basemapsRef.evt);
    this.basemapsRef.clearEvt();
    if (!isTargetOnTooltip && this.state.showBasemaps) {
      this.toggleBasemaps();
    }
  };

  onRecentRequestClose = () => {
    const { setRecentImagerySettings } = this.props;
    const isTargetOnTooltip = isParent(
      this.recentImageryRef,
      this.recentImageryRef.evt
    );
    this.recentImageryRef.clearEvt();
    if (!isTargetOnTooltip && this.props.recentSettings.active) {
      setRecentImagerySettings({ visible: false });
    }
  };

  toggleBasemaps = () => {
    const { setRecentImagerySettings } = this.props;
    this.setState(state => ({ showBasemaps: !state.showBasemaps }));
    setRecentImagerySettings({ visible: false });
  };

  handleToggleRecentImagery = () => {
    const {
      setMapSettings,
      setRecentImagerySettings,
      recentImageryDataset,
      recentActive,
      settings: { datasets, zoom }
    } = this.props;
    const newDatasets = recentActive
      ? datasets.filter(d => !d.isRecentImagery)
      : datasets.concat({
        dataset: recentImageryDataset.dataset,
        layers: [recentImageryDataset.layer],
        visibility: 1,
        opacity: 1,
        isRecentImagery: true
      });
    setMapSettings({
      datasets: newDatasets,
      zoom: !recentActive && zoom < 9 ? 9 : zoom
    });
    setRecentImagerySettings({
      visible: false
    });
    if (!recentActive) {
      track('recentImageryEnable');
    }
  };

  setBasemapsRef = ref => {
    this.basemapsRef = ref;
  };

  setRecentImageryRef = ref => {
    this.recentImageryRef = ref;
  };

  renderRecentImageryBtn = () => {
    const {
      recentSettings,
      recentLoading,
      recentActive,
      datasetsLoading
    } = this.props;
    const { visible } = recentSettings || {};

    return (
      <Button
        className="recent-imagery-btn"
        theme="theme-button-map-control"
        onClick={this.handleToggleRecentImagery}
        disabled={datasetsLoading}
        tooltip={
          !visible
            ? {
              text: !recentActive
                ? 'Activate Recent Imagery'
                : 'Disable Recent Imagery',
              hideOnClick: false
            }
            : undefined
        }
      >
        {recentLoading &&
          recentActive && <Loader className="recent-imagery-loader" />}
        <Icon
          icon={satelliteIcon}
          className={cx('satellite-icon', {
            '-active': recentActive
          })}
        />
      </Button>
    );
  };

  renderBasemapsBtn = () => {
    const { showBasemaps } = this.state;

    return (
      <Button
        className="basemaps-btn"
        theme="theme-button-map-control"
        onClick={this.toggleBasemaps}
        tooltip={
          !showBasemaps ? { text: 'Basemaps', hideOnClick: false } : undefined
        }
      >
        <Icon
          icon={globeIcon}
          className={cx('globe-icon', { '-active': showBasemaps })}
        />
      </Button>
    );
  };

  renderRecentImageryTooltip = () => {
    const { recentSettings } = this.props;
    const { visible } = recentSettings || {};

    return (
      <Tooltip
        theme="light"
        position="top-end"
        useContext
        interactive
        animateFill={false}
        open={visible}
        onRequestClose={this.onRecentRequestClose}
        html={<RecentImagerySettings ref={this.setRecentImageryRef} />}
        offset={100}
      >
        {this.renderRecentImageryBtn()}
      </Tooltip>
    );
  };

  renderBasemapsTooltip = () => {
    const { showBasemaps } = this.state;

    return (
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
            isDesktop={this.props.isDesktop}
          />
        }
      >
        {this.renderBasemapsBtn()}
      </Tooltip>
    );
  };

  renderZoomButtons = () => {
    const { settings, setMapSettings } = this.props;
    const { zoom, minZoom, maxZoom } = settings || {};

    return (
      <Fragment>
        <Button
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom - 1 });
            track('zoomOut');
          }}
          tooltip={{ text: 'Zoom out' }}
          disabled={zoom === minZoom}
        >
          <Icon icon={minusIcon} className="minus-icon" />
        </Button>
        <Button
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom + 1 });
            track('zoomIn');
          }}
          tooltip={{ text: 'Zoom in' }}
          disabled={zoom === maxZoom}
        >
          <Icon icon={plusIcon} className="plus-icon" />
        </Button>
      </Fragment>
    );
  };

  renderShowPanelsButton = () => {
    const { settings } = this.props;
    const { hidePanels } = settings || {};

    return (
      <Button
        theme="theme-button-map-control"
        onClick={this.handleHidePanels}
        tooltip={{ text: hidePanels ? 'Show panels' : 'Show map only' }}
      >
        <Icon
          icon={fullscreenIcon}
          className={cx('fullscreen-icon', { '-active': hidePanels })}
        />
      </Button>
    );
  };

  renderShareButton = () => {
    const { setShareModal } = this.props;

    return (
      <Button
        className="theme-button-map-control"
        onClick={() =>
          setShareModal({
            title: 'Share this view',
            shareUrl: window.location.href.includes('embed')
              ? window.location.href.replace('/embed', '')
              : window.location.href,
            embedUrl: window.location.href.includes('embed')
              ? window.location.href
              : window.location.href.replace('/map', '/embed/map'),
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
    );
  };

  renderPrintButton = () => (
    <Button
      theme="theme-button-map-control"
      tooltip={{ text: 'Print (not yet available)' }}
      onClick={() => track('printMap')}
      disabled
    >
      <Icon icon={printIcon} className="print-icon" />
    </Button>
  );

  renderMapPosition = () => {
    const { settings } = this.props;
    const { zoom, center } = settings || {};

    return (
      <div className="map-position">
        <span>zoom: {zoom}</span>
        <span>
          lat,lon:{' '}
          {`${format('.5f')(center.lat)}, ${format('.5f')(center.lng)}`}
        </span>
      </div>
    );
  };

  render() {
    const { className, settings, isDesktop } = this.props;
    const { hidePanels } = settings || {};

    return (
      <div className={`c-map-controls ${className || ''}`}>
        {isDesktop ? (
          <Fragment>
            {!hidePanels && (
              <div className="map-actions">
                {this.renderRecentImageryTooltip()}
                {this.renderBasemapsTooltip()}
              </div>
            )}
            <div className="controls-wrapper">
              {this.renderZoomButtons()}
              {this.renderShowPanelsButton()}
              {this.renderShareButton()}
              {this.renderPrintButton()}
            </div>
            {this.renderMapPosition()}
          </Fragment>
        ) : (
          <div className="mobile-controls-wrapper">
            {this.renderShareButton()}
            {this.renderRecentImageryBtn()}
          </div>
        )}
      </div>
    );
  }
}

MapControlsButtons.propTypes = {
  className: PropTypes.string,
  setMapSettings: PropTypes.func,
  setShareModal: PropTypes.func,
  settings: PropTypes.object,
  active: PropTypes.bool,
  setMenuSettings: PropTypes.func,
  recentSettings: PropTypes.object,
  recentLoading: PropTypes.bool,
  setRecentImagerySettings: PropTypes.func,
  recentImageryDataset: PropTypes.object,
  recentActive: PropTypes.bool,
  datasetsLoading: PropTypes.bool,
  isDesktop: PropTypes.bool
};

export default connect()(MapControlsButtons);
