import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import { SCREEN_M, SCREEN_MOBILE } from 'utils/constants';
import { track } from 'app/analytics';

import CountryDataProvider from 'providers/country-data-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import GeostoreProvider from 'providers/geostore-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';

import Widgets from 'components/widgets';
import Share from 'components/modals/share';
import SubNavMenu from 'components/subnav-menu';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import ModalMeta from 'components/modals/meta';
import ScrollTo from 'components/scroll-to';

import DashboardsHeader from 'pages/dashboards/components/header';
import Map from 'pages/dashboards/components/map';
import MapControls from 'pages/dashboards/components/map/components/map-controls';

import closeIcon from 'assets/icons/close.svg';
import './styles.scss';

class Page extends PureComponent {
  render() {
    const {
      showMapMobile,
      setDashboardsSettings,
      links,
      widgetAnchor,
      handleCategoryChange,
      noWidgetsMessage,
      widgets,
      activeWidget
    } = this.props;

    return (
      <div className="l-country">
        {showMapMobile && (
          <Button
            theme="square theme-button-light"
            className="close-map-button"
            onClick={() =>
              setDashboardsSettings({ showMapMobile: !showMapMobile })
            }
          >
            <Icon icon={closeIcon} />
          </Button>
        )}
        <div className="content-panel">
          <DashboardsHeader className="header" />
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
          <Widgets
            className="dashboard-widgets"
            noWidgetsMessage={noWidgetsMessage}
            widgets={widgets}
            activeWidget={activeWidget}
          />
        </div>
        <div className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}>
          <Sticky
            enabled={window.innerWidth > SCREEN_M}
            bottomBoundary=".l-country"
          >
            <div className="map-container">
              <Map />
            </div>
          </Sticky>
        </div>
        <MapControls
          className="map-controls"
          stickyOptions={{
            enabled: true,
            top: window.innerWidth >= SCREEN_MOBILE ? 15 : 73
          }}
        />
        <Share />
        <ModalMeta />
        {widgetAnchor && <ScrollTo target={widgetAnchor} />}
        <CountryDataProvider />
        <WhitelistsProvider />
        <GeostoreProvider />
        <DatasetsProvider />
        <LatestProvider />
      </div>
    );
  }
}

Page.propTypes = {
  showMapMobile: PropTypes.bool,
  setDashboardsSettings: PropTypes.func,
  links: PropTypes.array.isRequired,
  widgetAnchor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  noWidgetsMessage: PropTypes.string,
  handleCategoryChange: PropTypes.func,
  widgets: PropTypes.array,
  activeWidget: PropTypes.string
};

export default Page;
