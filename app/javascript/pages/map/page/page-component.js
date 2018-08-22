import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import WhitelistsProvider from 'providers/whitelists-provider';
import DatasetsProvider from 'providers/datasets-provider';
import LatestProvider from 'providers/latest-provider';

import Map from 'components/map';
import MapMenu from 'pages/map/menu';
import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import DataAnalysisMenu from 'pages/map/data-analysis-menu';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    const { analysis } = this.props;

    return (
      <div className="l-map">
        <Map />
        <MapMenu />
        <DataAnalysisMenu className="data-analysis-menu" />
        <Share />
        <ModalMeta />
        <CountryDataProvider location={analysis.location} />
        <WhitelistsProvider />
        <DatasetsProvider />
        <GeostoreProvider />
        <LatestProvider />
      </div>
    );
  }
}

Page.propTypes = {
  analysis: PropTypes.object
};

export default Page;
