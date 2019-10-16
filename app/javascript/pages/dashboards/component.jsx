import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import isEqual from 'lodash/isEqual';
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

import ErrorPage from 'pages/error';

import Widgets from 'components/widgets';
import Share from 'components/modals/share';
import SubNavMenu from 'components/subnav-menu';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import ModalMeta from 'components/modals/meta';
import ScrollTo from 'components/scroll-to';

import closeIcon from 'assets/icons/close.svg';

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
    handleCategoryChange: PropTypes.func,
    locationType: PropTypes.string,
    activeArea: PropTypes.object,
    areaLoading: PropTypes.bool
  };

  componentDidUpdate(prevProps) {
    const { activeArea } = this.props;
    const { activeArea: prevActiveArea } = prevProps;

    if (
      activeArea &&
      !activeArea.userArea &&
      !isEqual(activeArea, prevActiveArea)
    ) {
      track('publicArea', {
        label: activeArea.id
      });
    }
  }

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
      areaLoading
    } = this.props;
    const isAreaDashboard = locationType === 'aoi';

    return (
      <MediaQuery minWidth={SCREEN_M}>
        {isDesktop => (
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
                          track('selectDashboardCategory', {
                            label: l.category
                          });
                        }
                      }))}
                      checkActive
                    />
                  )}
                  <Widgets className="dashboard-widgets" />
                </div>
                <div
                  className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}
                >
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
                <CountryDataProvider />
                <WhitelistsProvider />
                <GeostoreProvider />
                <GeodescriberProvider />
              </Fragment>
            )}
            <AreasProvider />
          </div>
        )}
      </MediaQuery>
    );
  }
}

export default DashboardsPage;
