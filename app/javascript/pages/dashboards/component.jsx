import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import isEqual from 'lodash/isEqual';
import { logEvent } from 'app/analytics';
import { Media } from 'utils/responsive';

import CountryDataProvider from 'providers/country-data-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import GeostoreProvider from 'providers/geostore-provider';
import GeodescriberProvider from 'providers/geodescriber-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';
import AreasProvider from 'providers/areas-provider';

import ErrorPage from 'pages/error';

import Widgets from 'components/widgets';
import Share from 'components/modals/share';
import SubNavMenu from 'components/subnav-menu';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import ModalMeta from 'components/modals/meta';
import ScrollTo from 'components/scroll-to';
import DashboardPrompts from 'components/prompts/dashboard-prompts';

import closeIcon from 'assets/icons/close.svg';

import Map from './components/map';
import Header from './components/header';
import MapControls from './components/map-controls';
import PendingDashboard from './components/pending-dashboard';

import './styles.scss';

class DashboardsPage extends PureComponent {
  static propTypes = {
    showMapMobile: PropTypes.bool,
    closeMobileMap: PropTypes.func.isRequired,
    links: PropTypes.array,
    widgetAnchor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    handleCategoryChange: PropTypes.func,
    locationType: PropTypes.string,
    activeArea: PropTypes.object,
    areaLoading: PropTypes.bool,
    embed: PropTypes.bool,
    clearScrollTo: PropTypes.func,
    setDashboardPromptsSettings: PropTypes.func
  };

  state = {
    scrollY: 0
  };

  componentDidMount() {
    const { locationType, setDashboardPromptsSettings } = this.props;
    if (locationType === 'global' || locationType === 'country') {
      setDashboardPromptsSettings({
        open: true,
        stepIndex: 0,
        stepsKey: 'viewNationalDashboards'
      });
    }

    window.addEventListener('scroll', this.listenToScroll);
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeArea, setDashboardPromptsSettings } = this.props;
    const { activeArea: prevActiveArea } = prevProps;
    const { scrollY } = this.state;
    const { scrollY: prevScrollY } = prevState;

    if (
      activeArea &&
      !activeArea.userArea &&
      !isEqual(activeArea, prevActiveArea)
    ) {
      logEvent('publicArea', {
        label: activeArea.id
      });
    }

    if (scrollY === 0 && prevScrollY > scrollY) {
      // show download prompts
      setDashboardPromptsSettings({
        open: true,
        stepIndex: 0,
        stepsKey: 'downloadDashboardStats'
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
  }

  listenToScroll = () => {
    this.setState({
      scrollY: window.pageYOffset
    });
  };

  renderMap = () => {
    const { showMapMobile, closeMobileMap } = this.props;

    return (
      <div className="map-container">
        {showMapMobile && (
          <Button
            theme="square theme-button-light"
            className="close-map-button"
            onClick={closeMobileMap}
          >
            <Icon icon={closeIcon} />
          </Button>
        )}
        <Map />
      </div>
    );
  };

  render() {
    const {
      showMapMobile,
      links,
      widgetAnchor,
      handleCategoryChange,
      locationType,
      activeArea,
      areaLoading,
      clearScrollTo,
      embed
    } = this.props;

    const { status, location } = activeArea || {};

    const isAreaDashboard = locationType === 'aoi';
    const isPendingDashboard =
      status === 'pending' &&
      location &&
      !['country', 'wdpa'].includes(location.type);

    return (
      <div className="l-dashboards-page">
        {isAreaDashboard && !activeArea && !areaLoading ? (
          <ErrorPage
            title="Area not found"
            desc="This area has either been deleted or is no longer available."
          />
        ) : (
          <Fragment>
            <div className="content-panel">
              <Header className="header" />
              {links &&
                !!links.length && (
                <SubNavMenu
                  className="nav"
                  theme="theme-subnav-dark"
                  links={links.map(l => ({
                    ...l,
                    onClick: () => {
                      handleCategoryChange(l.category);
                      logEvent('selectDashboardCategory', {
                        label: l.category
                      });
                    }
                  }))}
                  checkActive
                />
              )}
              {isPendingDashboard && (
                <PendingDashboard
                  className="pending-message"
                  isUserDashboard={activeArea && activeArea.userArea}
                  areaId={activeArea && activeArea.id}
                />
              )}
              <Widgets className="dashboard-widgets" />
            </div>
            <div
              className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}
            >
              <Media greaterThanOrEqual="md">
                <Sticky bottomBoundary=".l-dashboards-page">
                  {this.renderMap()}
                </Sticky>
              </Media>
              <Media lessThan="md">
                {this.renderMap()}
              </Media>
            </div>
            <MapControls className="map-controls" />
            <Share />
            <ModalMeta />
            {widgetAnchor && (
              <ScrollTo target={widgetAnchor} afterScroll={clearScrollTo} />
            )}
            <DatasetsProvider />
            <LatestProvider />
            <CountryDataProvider />
            <WhitelistsProvider />
            <GeostoreProvider />
            <GeodescriberProvider />
          </Fragment>
        )}
        <AreasProvider />
        {!embed && (
          <Media greaterThanOrEqual="md">
            <DashboardPrompts />
          </Media>
        )}
      </div>
    );
  }
}

export default DashboardsPage;
