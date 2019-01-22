import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { format } from 'd3-format';
import { connect } from 'react-redux';
import cx from 'classnames';
import { isParent } from 'utils/dom';
import { track } from 'app/analytics';

import Basemaps from 'components/maps/components/basemaps';
import RecentImagerySettings from 'components/maps/main-map/components/recent-imagery/components/recent-imagery-settings';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import shareIcon from 'assets/icons/share.svg';
import fullscreenIcon from 'assets/icons/fit-zoom.svg';
import printIcon from 'assets/icons/print.svg';
import helpIocn from 'assets/icons/help.svg';
import globeIcon from 'assets/icons/globe.svg';
import satelliteIcon from 'assets/icons/satellite.svg';

import './map-controls-styles.scss';

class MapControlsButtons extends PureComponent {
  state = {
    pulseTourBtn: false
  };

  componentDidUpdate(prevProps) {
    const { mapTourOpen } = this.props;
    if (!mapTourOpen && mapTourOpen !== prevProps.mapTourOpen) {
      this.setPulseTourBtn(true);
      setTimeout(() => this.setPulseTourBtn(false), 3000);
    }
  }

  setPulseTourBtn = pulseTourBtn => this.setState({ pulseTourBtn });

  handleHidePanels = () => {
    const { setMainMapSettings, setMenuSettings, hidePanels } = this.props;
    setMainMapSettings({ hidePanels: !hidePanels });
    setMenuSettings({ menuSection: '' });
    this.setState({ showBasemaps: false });
    if (!hidePanels) {
      track('hidePanels');
    }
  };

  onBasemapsRequestClose = () => {
    const isTargetOnTooltip = isParent(this.basemapsRef, this.basemapsRef.evt);
    this.basemapsRef.clearEvt();
    if (!isTargetOnTooltip && this.props.showBasemaps) {
      this.toggleBasemaps();
    }
  };

  toggleBasemaps = () => {
    const { setMainMapSettings, showBasemaps, recentActive } = this.props;
    setMainMapSettings({ showBasemaps: !showBasemaps });
    if (recentActive) {
      this.handleToggleRecentImagery();
    }
  };

  handleToggleRecentImagery = () => {
    const {
      setMapSettings,
      recentImageryDataset,
      recentActive,
      mapSettings: { datasets, zoom }
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
    const { recentActive, datasetsLoading } = this.props;

    return (
      <Button
        className={cx('recent-imagery-btn', 'map-tour-recent-imagery')}
        theme="theme-button-map-control"
        onClick={this.handleToggleRecentImagery}
        disabled={datasetsLoading}
        tooltip={{
          text: 'Recent Satellite Imagery'
        }}
      >
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
    const { showBasemaps } = this.props;

    return (
      <Button
        className={cx('basemaps-btn')}
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
    const { recentActive } = this.props;

    return (
      <Tooltip
        theme="light"
        position="top-end"
        useContext
        interactive
        animateFill={false}
        open={recentActive}
        html={
          <RecentImagerySettings
            onClickClose={this.handleToggleRecentImagery}
          />
        }
        offset={120}
      >
        {this.renderRecentImageryBtn()}
      </Tooltip>
    );
  };

  renderBasemapsTooltip = () => {
    const { showBasemaps } = this.props;

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
    const { mapSettings, setMapSettings } = this.props;
    const { zoom, minZoom, maxZoom } = mapSettings || {};

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
    const { hidePanels } = this.props;

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

  renderMapTourBtn = () => (
    <Button
      theme="theme-button-map-control"
      tooltip={{ text: 'Take a tour of the map' }}
      onClick={() => this.props.setMapTourOpen(true)}
    >
      <Icon
        icon={helpIocn}
        className={cx('map-tour-icon', {
          'pulse-tour-btn': this.state.pulseTourBtn
        })}
      />
    </Button>
  );

  renderMapPosition = () => {
    const { mapSettings } = this.props;
    const { zoom, center } = mapSettings || {};

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
    const { className, isDesktop, hidePanels } = this.props;

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
            <div className="map-tour-map-controls">
              <div className="controls-wrapper">
                {this.renderZoomButtons()}
                {this.renderShowPanelsButton()}
                {this.renderShareButton()}
                {this.renderPrintButton()}
                {this.renderMapTourBtn()}
              </div>
              {this.renderMapPosition()}
            </div>
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
  setMainMapSettings: PropTypes.func,
  setShareModal: PropTypes.func,
  mapSettings: PropTypes.object,
  setMenuSettings: PropTypes.func,
  setMapTourOpen: PropTypes.func,
  mapTourOpen: PropTypes.bool,
  showBasemaps: PropTypes.bool,
  hidePanels: PropTypes.bool,
  recentImageryDataset: PropTypes.object,
  recentActive: PropTypes.bool,
  datasetsLoading: PropTypes.bool,
  isDesktop: PropTypes.bool
};

export default connect()(MapControlsButtons);
