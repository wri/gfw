import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import DatasetsProvider from 'providers/datasets-provider';

import Map from 'components/map-v2';
import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import DataAnalysisMenu from 'pages/map/components/data-analysis-menu';

import './styles.scss';

class MapPage extends PureComponent {
  render() {
    const { analysis, mapSettings: { hidePanels } } = this.props;

    return (
      <div className="l-map">
        <div className="map">
          <Map recentImagery />
        </div>
        {!hidePanels && <DataAnalysisMenu className="data-analysis-menu" />}
        <Share />
        <ModalMeta />
        <CountryDataProvider location={analysis.location} />
        <DatasetsProvider />
        <GeostoreProvider />
      </div>
    );
  }
}

MapPage.propTypes = {
  analysis: PropTypes.object,
  mapSettings: PropTypes.object
};

export default MapPage;
