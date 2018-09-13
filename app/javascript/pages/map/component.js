import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import DatasetsProvider from 'providers/datasets-provider';

import Map from 'components/map-v2';
import ModalMeta from 'components/modals/meta';
import ModalSource from 'components/modals/sources';
import Share from 'components/modals/share';
import DataAnalysisMenu from 'pages/map/components/data-analysis-menu';

import './styles.scss';

class MapPage extends PureComponent {
  render() {
    const { mapSettings: { hidePanels } } = this.props;

    return (
      <div className="l-map">
        <div className="map">
          <Map recentImagery />
        </div>
        {!hidePanels && <DataAnalysisMenu className="data-analysis-menu" />}
        <Share />
        <ModalMeta />
        <ModalSource />
        <CountryDataProvider />
        <DatasetsProvider />
        <GeostoreProvider />
      </div>
    );
  }
}

MapPage.propTypes = {
  mapSettings: PropTypes.object
};

export default MapPage;
