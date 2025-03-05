import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import isEqual from 'lodash/isEqual';

import { Mobile, Desktop } from '@worldresources/gfw-components';
import { trackEvent } from 'utils/analytics';
import CountryDataProvider from 'providers/country-data-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import GeostoreProvider from 'providers/geostore-provider';
import GeodescriberProvider from 'providers/geodescriber-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';
import AreasProvider from 'providers/areas-provider';
import LocationProvider from 'providers/location-provider';
import PlanetBasemapsProvider from 'providers/planet-provider';
import MyGfwProvider from 'providers/mygfw-provider';
import MetaProvider from 'providers/meta-provider';

// import dashboardLinksSSR from 'data/dashboard-menu-ssr';

import CATEGORIES from 'data/categories';

import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import ClimateModal from 'components/modals/climate';
import FiresModal from 'components/modals/fires';

import Widgets from 'components/widgets';
import SubNavMenu from 'components/subnav-menu';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import ScrollTo from 'components/scroll-to';
import DashboardPrompts from 'components/prompts/dashboard-prompts';

import closeIcon from 'assets/icons/close.svg?sprite';

import SubCategories from './components/subcategories';
import GFRBanner from './components/gfr-banner';
import Map from './components/map';
import Header from './components/header';
import MapControls from './components/map-controls';
import PendingDashboard from './components/pending-dashboard';
import GlobalSentence from './components/global-sentence';

const isServer = typeof window === 'undefined';
class DashboardsPage extends PureComponent {
  static propTypes = {
    ssrLocation: PropTypes.object,
    showMapMobile: PropTypes.bool,
    setShowMap: PropTypes.func.isRequired,
    links: PropTypes.array,
    widgetAnchor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    globalSentence: PropTypes.object,
    locationType: PropTypes.string,
    activeArea: PropTypes.object,
    embed: PropTypes.bool,
    category: PropTypes.string,
    clearScrollTo: PropTypes.func,
    setDashboardPromptsSettings: PropTypes.func,
    basePath: PropTypes.string,
  };

  state = {
    scrollY: 0,
  };

  componentDidMount() {
    const { locationType, setDashboardPromptsSettings } = this.props;
    if (locationType === 'global' || locationType === 'country') {
      setDashboardPromptsSettings({
        open: true,
        stepIndex: 0,
        stepsKey: 'viewNationalDashboards',
      });
    }

    if (!isServer) {
      window.addEventListener('scroll', this.listenToScroll);
    }
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
      trackEvent({
        category: 'Areas of interest',
        action: 'Visit a shared area of interest',
        label: activeArea.id,
      });
    }

    if (scrollY === 0 && prevScrollY > scrollY) {
      // show download prompts
      setDashboardPromptsSettings({
        open: true,
        stepIndex: 0,
        stepsKey: 'downloadDashboardStats',
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll);
  }

  listenToScroll = () => {
    this.setState({
      scrollY: window.pageYOffset,
    });
  };

  renderMap = () => {
    const { showMapMobile, setShowMap } = this.props;

    return (
      <div className="map-container">
        {showMapMobile && (
          <Button
            theme="square theme-button-light"
            className="close-map-button"
            onClick={() => setShowMap(false)}
          >
            <Icon icon={closeIcon} />
          </Button>
        )}
        <Map />
      </div>
    );
  };

  handleNavigationLinks() {
    const { links, basePath } = this.props;
    if (isServer && basePath) {
      return links.map((l) => ({
        ...l,
        href: basePath,
        as: `/dashboards${basePath}${l.as}`,
      }));
    }
    return links;
  }

  render() {
    const {
      showMapMobile,
      links,
      widgetAnchor,
      ssrLocation,
      activeArea,
      clearScrollTo,
      globalSentence,
      embed,
      category,
    } = this.props;
    const { status, location } = activeArea || {};

    const isPendingDashboard =
      status === 'pending' &&
      location &&
      !['country', 'wdpa'].includes(location.type);

    const groupBySubcategory =
      CATEGORIES.find(({ value }) => category === value)?.settings?.dashboard
        ?.groupBySubcategory || false;

    return (
      <div className="l-dashboards-page">
        <div className="content-panel">
          <Header
            className="header"
            handleSSRLocation={ssrLocation}
            globalSentence={globalSentence}
          />
          {links && !!links.length && (
            <SubNavMenu
              className="nav"
              theme="theme-subnav-dark"
              links={this.handleNavigationLinks()}
              checkActive
            />
          )}
          <GlobalSentence handleSSRLocation={ssrLocation} />
          {isPendingDashboard && (
            <PendingDashboard
              className="pending-message"
              isUserDashboard={activeArea && activeArea.userArea}
              areaId={activeArea && activeArea.id}
            />
          )}
          {groupBySubcategory && <SubCategories />}
          <Widgets
            className="dashboard-widgets"
            groupBySubcategory={groupBySubcategory}
            dashboard
          />
          {this.props.locationType === 'global' && <GFRBanner />}
        </div>
        <div className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}>
          <Desktop>
            <Sticky bottomBoundary=".l-dashboards-page">
              {this.renderMap()}
            </Sticky>
          </Desktop>
          <Mobile className="mobile-map">{this.renderMap()}</Mobile>
        </div>
        <Desktop>
          <MapControls className="map-controls" />
        </Desktop>
        <Share />
        <ModalMeta metaType="widget" />
        {widgetAnchor && (
          <ScrollTo target={widgetAnchor} afterScroll={clearScrollTo} />
        )}
        <MetaProvider />
        <DatasetsProvider />
        <LatestProvider />
        <CountryDataProvider />
        <WhitelistsProvider />
        <GeostoreProvider />
        <GeodescriberProvider />
        <AreasProvider />
        <LocationProvider />
        <PlanetBasemapsProvider />
        <MyGfwProvider />
        {!embed && (
          <Desktop>
            <DashboardPrompts />
          </Desktop>
        )}
        <ClimateModal />
        <FiresModal />
      </div>
    );
  }
}

export default DashboardsPage;
