import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import { format } from 'd3-format';
import { connect } from 'react-redux';
import cx from 'classnames';
import { isParent } from 'utils/dom';
import { trackEvent } from 'utils/analytics';

import plusIcon from 'assets/icons/plus.svg?sprite';
import minusIcon from 'assets/icons/minus.svg?sprite';
import shareIcon from 'assets/icons/share.svg?sprite';
import fullscreenIcon from 'assets/icons/fit-zoom.svg?sprite';
import helpIocn from 'assets/icons/help.svg?sprite';
import searchIcon from 'assets/icons/search.svg?sprite';
import settingsIcon from 'assets/icons/settings.svg?sprite';
import satelliteIcon from 'assets/icons/satellite.svg?sprite';

import Basemaps from 'components/basemaps';
import RecentImagerySettings from 'components/recent-imagery/components/recent-imagery-settings';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

const isServer = typeof window === 'undefined';

class MapControlsButtons extends PureComponent {
  state = {
    pulseTourBtn: false,
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

  setPulseTourBtn = (pulseTourBtn) => this.setState({ pulseTourBtn });

  handleHidePanels = () => {
    const { setMainMapSettings, setMenuSettings, hidePanels } = this.props;
    setMainMapSettings({ hidePanels: !hidePanels });
    setMenuSettings({ menuSection: '' });
    if (!hidePanels) {
      trackEvent({
        category: 'Map settings',
        action: 'Other buttons',
        label: 'Map only',
      });
    }
  };

  onBasemapsRequestClose = () => {
    const isTargetOnTooltip = isParent(this.basemapsRef, this.basemapsRef.evt);
    this.basemapsRef.clearEvt();
    if (
      !isTargetOnTooltip &&
      !this.props.metaModalOpen &&
      this.props.showBasemaps
    ) {
      this.toggleBasemaps();
    }
  };

  toggleBasemaps = (track = false) => {
    const { setMainMapSettings, showBasemaps, showRecentImagery } = this.props;
    setMainMapSettings({ showBasemaps: !showBasemaps });
    if (showRecentImagery) {
      setMainMapSettings({ showRecentImagery: false });
    }
    if (track) {
      trackEvent({
        category: 'Open Modal',
        action: 'Click to Open',
        label: 'Imagery caret',
      });
    }
  };

  handleToggleRecentImagery = () => {
    const {
      setMapSettings,
      recentImageryDataset,
      showRecentImagery,
      datasets,
      viewport: { zoom },
    } = this.props;
    const newDatasets = showRecentImagery
      ? datasets.filter((d) => !d.isRecentImagery)
      : datasets.concat({
          dataset: recentImageryDataset.dataset,
          layers: [recentImageryDataset.layer],
          visibility: true,
          opacity: 1,
          isRecentImagery: true,
        });
    setMapSettings({
      datasets: newDatasets,
      zoom: showRecentImagery && zoom < 9 ? 9 : zoom,
    });
    if (showRecentImagery) {
      trackEvent({
        category: 'Map settings',
        action: 'Recent imagery feature',
        label: 'User turns on recent imagery',
      });
    }
  };

  setBasemapsRef = (ref) => {
    this.basemapsRef = ref;
  };

  setRecentImageryRef = (ref) => {
    this.recentImageryRef = ref;
  };

  renderRecentImageryBtn = () => {
    const {
      showRecentImagery,
      datasetsLoading,
      setMainMapSettings,
      setMenuSettings,
      isDesktop,
    } = this.props;

    return (
      <Button
        className={cx(
          'map-control wide',
          'map-tool-btn recent-imagery-btn',
          { active: showRecentImagery },
          'map-tour-recent-imagery'
        )}
        theme="theme-button-map-control"
        onClick={() => {
          setMainMapSettings({ showRecentImagery: !showRecentImagery });
          if (!showRecentImagery) {
            trackEvent({
              category: 'Map settings',
              action: 'Recent imagery feature',
              label: 'User opens the config window',
            });
          }
          if (!isDesktop) {
            setMenuSettings({
              menuSection: !showRecentImagery ? 'recent-imagery-collapsed' : '',
            });
          }
        }}
        disabled={datasetsLoading}
        tooltip={{
          text: 'Recent Satellite Imagery',
        }}
      >
        <Icon
          icon={satelliteIcon}
          className={cx('satellite-icon', {
            '-active': showRecentImagery,
          })}
        />
      </Button>
    );
  };

  renderRecentImageryTooltip = () => {
    const { showRecentImagery, setMainMapSettings } = this.props;

    return (
      <Tooltip
        className="recent-imagery-tooltip"
        theme="light"
        position="top-end"
        useContext
        interactive
        animateFill={false}
        arrow
        open={showRecentImagery}
        html={(
          <RecentImagerySettings
            className="recent-imagery-panel"
            onClickClose={() =>
              setMainMapSettings({ showRecentImagery: false })}
          />
        )}
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
        className="basemaps-tooltip"
        theme="light"
        position="top-end"
        useContext
        interactive
        animateFill={false}
        open={showBasemaps}
        onRequestClose={this.onBasemapsRequestClose}
        html={(
          <Basemaps
            className="basemaps-panel"
            onClose={this.toggleBasemaps}
            ref={this.setBasemapsRef}
            isDesktop={this.props.isDesktop}
          />
        )}
      />
    );
  };

  renderZoomButtons = () => {
    const {
      viewport: { zoom },
      setMapSettings,
      maxZoom,
      minZoom,
    } = this.props;

    return (
      <Fragment>
        <Button
          className="map-control"
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom - 1 < minZoom ? minZoom : zoom - 1 });
            trackEvent({
              category: 'Map settings',
              action: 'Other buttons',
              label: 'Zoom out',
            });
          }}
          tooltip={{ text: 'Zoom out' }}
          disabled={zoom <= minZoom}
        >
          <Icon icon={minusIcon} className="minus-icon" />
        </Button>
        <Button
          className="map-control"
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom + 1 > maxZoom ? maxZoom : zoom + 1 });
            trackEvent({
              category: 'Map settings',
              action: 'Other buttons',
              label: 'Zoom in',
            });
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
        className="map-control"
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

  renderSearchButton = () => {
    const { setMenuSettings } = this.props;

    return (
      <Button
        className="map-control"
        theme="theme-button-map-control"
        onClick={() => setMenuSettings({ menuSection: 'search' })}
        tooltip={{ text: 'Search' }}
      >
        <Icon icon={searchIcon} />
      </Button>
    );
  };

  renderShareButton() {
    const { setShareModal } = this.props;

    return (
      <Button
        className="map-control -share"
        theme="theme-button-map-control"
        onClick={() =>
          setShareModal({
            title: 'Share this view',
            shareUrl:
              !isServer &&
              (window.location.href.includes('embed')
                ? window.location.href.replace('/embed', '')
                : window.location.href),
            embedUrl:
              !isServer &&
              (window.location.href.includes('embed')
                ? window.location.href
                : window.location.href.replace('/map', '/embed/map')),
          })}
        tooltip={{ text: 'Share or embed this view' }}
      >
        <Icon icon={shareIcon} />
      </Button>
    );
  }

  // <Tooltip
  //       className="basemaps-tooltip"
  //       theme="light"
  //       position="top-end"
  //       useContext
  //       interactive
  //       arrow
  //       animateFill={false}
  //       open={showBasemaps}
  //       onRequestClose={this.onBasemapsRequestClose}
  //       html={(
  //         <Basemaps
  //           className="basemaps-panel"
  //           onClose={this.toggleBasemaps}
  //           ref={this.setBasemapsRef}
  //           isDesktop={this.props.isDesktop}
  //         />
  //       )}
  //     />

  renderMapOptions() {
    return (
      <Button
        className="map-control"
        theme="theme-button-map-control"
        tooltip={{ text: 'Map settings' }}
        useContext
        interactive
        onClick={() => this.toggleBasemaps(true)}
        onRequestClose={this.onBasemapsRequestClose}
      >
        <Icon icon={settingsIcon} className="settings-icon" />
      </Button>
    );
  }

  renderMapTourBtn = () => (
    <Button
      className="map-control"
      theme="theme-button-map-control"
      tooltip={{ text: 'Map How-To Guide' }}
      onClick={() => this.props.setModalWelcomeOpen(true)}
    >
      <Icon
        icon={helpIocn}
        className={cx('map-tour-icon', {
          'pulse-tour-btn': this.state.pulseTourBtn,
        })}
      />
    </Button>
  );

  renderMapPosition = () => {
    const {
      viewport: { zoom, latitude, longitude },
    } = this.props;

    return (
      <div className="map-position">
        <span className="notranslate">
          zoom:&nbsp;
          {format('.2f')(zoom)}
        </span>
        <span className="notranslate">
          lat, lon: {`${format('.5f')(latitude)}, ${format('.5f')(longitude)}`}
        </span>
      </div>
    );
  };

  render() {
    const { className, isDesktop, showBasemaps, hidePanels } = this.props;

    return (
      <div className={`c-map-controls ${className || ''}`}>
        {isDesktop ? (
          <Fragment>
            {!hidePanels && (
              <div className="map-actions">{this.renderBasemapsTooltip()}</div>
            )}
            <div className="map-tour-map-controls">
              <div className="controls-wrapper">
                {this.renderZoomButtons()}
                {this.renderShowPanelsButton()}
                {this.renderShareButton()}
                {this.renderMapOptions(showBasemaps)}
                {this.renderMapTourBtn()}
              </div>
              {this.renderMapPosition()}
            </div>
          </Fragment>
        ) : (
          <Fragment>
            <div className="mobile-controls-wrapper">
              {this.renderRecentImageryBtn()}
            </div>
            <div className="mobile-controls-wrapper">
              {this.renderSearchButton()}
              {this.renderShareButton()}
            </div>
          </Fragment>
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
  metaModalOpen: PropTypes.bool,
};

export default connect()(MapControlsButtons);
