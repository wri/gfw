import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { format } from 'd3-format';
import { connect } from 'react-redux';
import cx from 'classnames';
import { isParent } from 'utils/dom';
import { track } from 'app/analytics';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import shareIcon from 'assets/icons/share.svg';
import fullscreenIcon from 'assets/icons/fit-zoom.svg';
import printIcon from 'assets/icons/print.svg';
import helpIocn from 'assets/icons/help.svg';
import globeIcon from 'assets/icons/globe.svg';
import satelliteIcon from 'assets/icons/satellite.svg';

import Basemaps from 'components/basemaps';
import RecentImagerySettings from 'components/recent-imagery/components/recent-imagery-settings';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import './styles.scss';

class MapControlsButtons extends PureComponent {
  state = {
    pulseTourBtn: false
  };

  componentDidUpdate(prevProps) {
    const { mapTourOpen, showRecentImagery } = this.props;
    if (!mapTourOpen && mapTourOpen !== prevProps.mapTourOpen) {
      this.setPulseTourBtn(true);
      setTimeout(() => this.setPulseTourBtn(false), 3000);
    }

    if (
      showRecentImagery &&
      showRecentImagery !== prevProps.showRecentImagery
    ) {
      this.handleToggleRecentImagery();
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
    const { setMainMapSettings, showBasemaps, showRecentImagery } = this.props;
    setMainMapSettings({ showBasemaps: !showBasemaps });
    if (showRecentImagery) {
      setMainMapSettings({ showRecentImagery: false });
    }
  };

  handleToggleRecentImagery = () => {
    const {
      setMapSettings,
      recentImageryDataset,
      showRecentImagery,
      datasets,
      viewport: { zoom }
    } = this.props;
    const newDatasets = showRecentImagery
      ? datasets.filter(d => !d.isRecentImagery)
      : datasets.concat({
        dataset: recentImageryDataset.dataset,
        layers: [recentImageryDataset.layer],
        visibility: true,
        opacity: 1,
        isRecentImagery: true
      });
    setMapSettings({
      datasets: newDatasets,
      zoom: showRecentImagery && zoom < 9 ? 9 : zoom
    });
    if (showRecentImagery) {
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
      showRecentImagery,
      datasetsLoading,
      setMainMapSettings
    } = this.props;

    return (
      <Button
        className={cx(
          'map-tool-btn recent-imagery-btn',
          { active: showRecentImagery },
          'map-tour-recent-imagery'
        )}
        theme="theme-button-map-control wide"
        onClick={() => {
          setMainMapSettings({ showRecentImagery: !showRecentImagery });
          if (!showRecentImagery) {
            track('recentImageryOpen');
          }
        }}
        disabled={datasetsLoading}
        tooltip={{
          text: 'Recent Satellite Imagery'
        }}
      >
        <Icon
          icon={satelliteIcon}
          className={cx('satellite-icon', {
            '-active': showRecentImagery
          })}
        />
      </Button>
    );
  };

  renderBasemapsBtn = () => {
    const { showBasemaps, activeBasemap } = this.props;

    return (
      <Button
        className={cx('map-tool-btn basemaps-btn', { active: showBasemaps })}
        theme="theme-button-map-control wide"
        onClick={this.toggleBasemaps}
        tooltip={
          !showBasemaps
            ? { text: 'Map Settings', hideOnClick: false }
            : undefined
        }
      >
        {activeBasemap ? (
          <div className="basemaps-btn-content">
            <img
              className="basemaps-btn-img"
              src={activeBasemap.image}
              alt={activeBasemap.value}
            />
            <div className="basemaps-btn-label-wrapper">
              <span className="basemaps-btn-label">{activeBasemap.label}</span>
              {(activeBasemap.year || // satellite
                activeBasemap.planetYear) && ( // planet imagery
                <span className="basemaps-btn-label-small">
                  {activeBasemap.year ||
                    (activeBasemap.period // YYYY
                      ? `${activeBasemap.planetYear}/${activeBasemap.period}` // YYYY/mmm
                      : activeBasemap.planetYear)}
                </span>
              )}
            </div>
          </div>
        ) : (
          <Icon
            icon={globeIcon}
            className={cx('globe-icon', { '-active': showBasemaps })}
          />
        )}
      </Button>
    );
  };

  renderRecentImageryTooltip = () => {
    const { showRecentImagery, setMainMapSettings } = this.props;

    return (
      <Tooltip
        theme="light"
        position="top-end"
        useContext
        interactive
        animateFill={false}
        arrow
        open={showRecentImagery}
        html={
          <RecentImagerySettings
            onClickClose={() =>
              setMainMapSettings({ showRecentImagery: false })
            }
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
        arrow
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
    const { viewport: { zoom }, setMapSettings, maxZoom, minZoom } = this.props;

    return (
      <Fragment>
        <Button
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom - 1 < minZoom ? minZoom : zoom - 1 });
            track('zoomOut');
          }}
          tooltip={{ text: 'Zoom out' }}
          disabled={zoom <= minZoom}
        >
          <Icon icon={minusIcon} className="minus-icon" />
        </Button>
        <Button
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom + 1 > maxZoom ? maxZoom : zoom + 1 });
            track('zoomIn');
          }}
          tooltip={{ text: 'Zoom in' }}
          disabled={zoom >= maxZoom}
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
              : window.location.href.replace('/map', '/embed/map')
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
      tooltip={{ text: 'Map How-To Guide' }}
      onClick={() => this.props.setModalWelcomeOpen(true)}
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
    const { viewport: { zoom, latitude, longitude } } = this.props;

    return (
      <div className="map-position">
        <span className="notranslate">zoom: {format('.2f')(zoom)}</span>
        <span className="notranslate">
          lat, lon: {`${format('.5f')(latitude)}, ${format('.5f')(longitude)}`}
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
  viewport: PropTypes.object,
  setMenuSettings: PropTypes.func,
  setModalWelcomeOpen: PropTypes.func,
  mapTourOpen: PropTypes.bool,
  showBasemaps: PropTypes.bool,
  hidePanels: PropTypes.bool,
  recentImageryDataset: PropTypes.object,
  showRecentImagery: PropTypes.bool,
  datasetsLoading: PropTypes.bool,
  isDesktop: PropTypes.bool,
  datasets: PropTypes.array,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  activeBasemap: PropTypes.object
};

export default connect()(MapControlsButtons);
