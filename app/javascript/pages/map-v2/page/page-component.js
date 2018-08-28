import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';
import MyGFW from 'providers/mygfw-provider';

import Header from 'components/header';
import Map from 'components/map-v2';
import MapMenu from 'pages/map-v2/menu';
import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import DataAnalysisMenu from 'pages/map-v2/data-analysis-menu';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    const { analysis, handleShowMenu, showHeader, loggedIn } = this.props;

    return (
      <div className="l-map">
        <Header
          className="map-header"
          showHeader={showHeader}
          toggleMenu={handleShowMenu}
          loggedIn={loggedIn}
          showPanel
          fullScreen
        />
        <Map />
        <MapMenu toggleMenu={handleShowMenu} />
        <DataAnalysisMenu className="data-analysis-menu" />
        <Share />
        <ModalMeta />
        <CountryDataProvider location={analysis.location} />
        <WhitelistsProvider />
        <DatasetsProvider />
        <GeostoreProvider />
        <LatestProvider />
        <MyGFW />
      </div>
    );
  }
}

Page.propTypes = {
  analysis: PropTypes.object,
  handleShowMenu: PropTypes.func,
  showHeader: PropTypes.bool,
  loggedIn: PropTypes.bool
};

export default Page;
