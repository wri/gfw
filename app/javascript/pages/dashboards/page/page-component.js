import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Sticky from 'react-stickynode';
import { SCREEN_M, SCREEN_MOBILE } from 'utils/constants';

import CountryDataProvider from 'providers/country-data-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import LayerSpecProvider from 'providers/layerspec-provider';
import DatasetsProvider from 'providers/datasets-provider';

import Meta from 'components/meta';
import Widgets from 'components/widgets';
import Share from 'components/modals/share';
import Map from 'components/map-old';
import MapControls from 'components/map-old/components/map-controls';
import SubNavMenu from 'components/subnav-menu';
import Button from 'components/ui/button';
import Icon from 'components/ui/icon';
import ModalMeta from 'components/modals/meta';
import ScrollTo from 'components/scroll-to';

import Header from 'pages/dashboards/header';

import closeIcon from 'assets/icons/close.svg';
import './page-styles.scss';

class Page extends PureComponent {
  render() {
    const {
      showMapMobile,
      setShowMapMobile,
      links,
      isGeostoreLoading,
      widgetAnchor,
      activeWidget,
      setMapZoom,
      widgets,
      title,
      payload,
      query
    } = this.props;

    return (
      <div className="l-country">
        {showMapMobile && (
          <Button
            theme="square theme-button-light"
            className="close-map-button"
            onClick={() => setShowMapMobile(!showMapMobile)}
          >
            <Icon icon={closeIcon} />
          </Button>
        )}
        <div className="content-panel">
          <Header
            className="header"
            widgets={widgets}
            location={payload}
            query={query}
          />
          <SubNavMenu
            className="nav"
            theme="theme-subnav-dark"
            links={links}
            checkActive
          />
          <Widgets
            widgets={widgets}
            activeWidget={activeWidget}
            setShowMapMobile={setShowMapMobile}
            location={payload}
            query={query}
          />
        </div>
        <div className={`map-panel ${showMapMobile ? '-open-mobile' : ''}`}>
          <Sticky
            enabled={window.innerWidth > SCREEN_M}
            bottomBoundary=".l-country"
          >
            <div className="map-container">
              <Map widgetKey={activeWidget} miniLegend />
            </div>
          </Sticky>
        </div>
        {!isGeostoreLoading && (
          <MapControls
            className="map-controls"
            stickyOptions={{
              enabled: true,
              top: window.innerWidth >= SCREEN_MOBILE ? 15 : 73
            }}
            handleZoomIn={() => setMapZoom({ sum: 1 })}
            handleZoomOut={() => setMapZoom({ sum: -1 })}
          />
        )}
        <Share />
        <ModalMeta />
        {widgetAnchor && <ScrollTo target={widgetAnchor} />}
        <CountryDataProvider location={payload} />
        <WhitelistsProvider />
        <LayerSpecProvider />
        <DatasetsProvider />
        <Meta
          title={title}
          description="Data about forest change, tenure, forest related employment and land use in"
        />
        {widgetAnchor && <ScrollTo target={widgetAnchor} />}
      </div>
    );
  }
}

Page.propTypes = {
  showMapMobile: PropTypes.bool.isRequired,
  setShowMapMobile: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  isGeostoreLoading: PropTypes.bool,
  widgets: PropTypes.array,
  widgetAnchor: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  activeWidget: PropTypes.string,
  title: PropTypes.string,
  payload: PropTypes.object,
  query: PropTypes.object,
  setMapZoom: PropTypes.func
};

export default Page;
