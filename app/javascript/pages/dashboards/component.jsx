import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import { SCREEN_M } from 'utils/constants';
import { track } from 'app/analytics';
import MediaQuery from 'react-responsive';

import CountryDataProvider from 'providers/country-data-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import GeostoreProvider from 'providers/geostore-provider';
import GeodescriberProvider from 'providers/geodescriber-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';
import AreasProvider from 'providers/areas-provider';

import Widgets from 'components/widgets';
import Share from 'components/modals/share';
import SubNavMenu from 'components/subnav-menu';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import ModalMeta from 'components/modals/meta';
import ScrollTo from 'components/scroll-to';

import closeIcon from 'assets/icons/close.svg';

import PendingDashboard from './components/pending-dashboard';
import Map from './components/map';
import Header from './components/header';
import MapControls from './components/map-controls';

import './styles.scss';

class DashboardsPage extends PureComponent {
  static propTypes = {
    showMapMobile: PropTypes.bool,
    closeMobileMap: PropTypes.func.isRequired,
    links: PropTypes.array,
    widgetAnchor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    noWidgetsMessage: PropTypes.string,
    handleCategoryChange: PropTypes.func,
    widgets: PropTypes.array,
    activeWidgetSlug: PropTypes.string,
    locationType: PropTypes.string,
    activeArea: PropTypes.object
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
      noWidgetsMessage,
      widgets,
      activeWidgetSlug,
      locationType,
      activeArea
    } = this.props;
    const isCountryDashboard =
      locationType === 'country' || locationType === 'global';
    const isAreaDashboard = locationType === 'aoi';

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
          <div className="l-dashboards-page">
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
                      track('selectDashboardCategory', {
                        label: l.category
                      });
                    }
                  }))}
                  checkActive
                />
              )}
              <PendingDashboard
                className="pending-message"
                isUserDashboard={activeArea && activeArea.userArea}
              />
              <Widgets
                className="dashboard-widgets"
                noWidgetsMessage={noWidgetsMessage}
                widgets={widgets}
                activeWidget={activeWidgetSlug}
              />
            </div>
            <div className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}>
              {isDesktop ? (
                <Sticky bottomBoundary=".l-dashboards-page">
                  {this.renderMap()}
                </Sticky>
              ) : (
                this.renderMap()
              )}
            </div>
            <MapControls className="map-controls" />
            <Share />
            <ModalMeta />
            {widgetAnchor && <ScrollTo target={widgetAnchor} />}
            <DatasetsProvider />
            <LatestProvider />
            {isAreaDashboard && <AreasProvider />}
            {isCountryDashboard && (
              <Fragment>
                <CountryDataProvider />
                <WhitelistsProvider />
              </Fragment>
            )}
            <GeostoreProvider />
            <GeodescriberProvider />
          </div>
        )}
      </MediaQuery>
    );
  }
}

export default DashboardsPage;
