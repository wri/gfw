import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import Sticky from 'react-stickynode';
import { SCREEN_M } from 'utils/constants';
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
import ModalTCL from 'components/modals/loss-disclaimer';
import ScrollTo from 'components/scroll-to';

import closeIcon from 'assets/icons/close.svg';

import Map from './components/map';
import Header from './components/header';

import './styles.scss';

class Page extends PureComponent {
  render() {
    const {
      showMapMobile,
      setShowMapMobile,
      links,
      widgetAnchor,
      handleCategoryChange,
      noWidgetsMessage,
      widgets,
      activeWidgetSlug
    } = this.props;

    return (
      <div className="l-country">
        {showMapMobile && (
          <Button
            theme="square theme-button-light"
            className="close-map-button"
            // onClick={() => setShowMapMobile(!showMapMobile)}
          >
            <Icon icon={closeIcon} />
          </Button>
        )}
        <div className="content-panel">
          <Header className="header" />
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
            activeWidget={activeWidgetSlug}
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
        <Share />
        <ModalMeta />
        <ModalTCL />
        {widgetAnchor && <ScrollTo target={widgetAnchor} />}
        <CountryDataProvider />
        <DatasetsProvider />
        <LatestProvider />
        <WhitelistsProvider />
        <GeostoreProvider />
      </div>
    );
  }
}

Page.propTypes = {
  showMapMobile: PropTypes.bool.isRequired,
  setShowMapMobile: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  widgetAnchor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  noWidgetsMessage: PropTypes.string,
  handleCategoryChange: PropTypes.func,
  widgets: PropTypes.array,
  activeWidgetSlug: PropTypes.string
};

export default Page;
