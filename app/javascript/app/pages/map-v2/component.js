import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import GeostoreProvider from 'providers/geostore-provider';
import DatasetsProvider from 'providers/datasets-provider';

import Map from 'components/map-v2';
import MapMenu from 'pages/map-v2/components/menu';
import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import DataAnalysisMenu from 'pages/map-v2/components/data-analysis-menu';

import './styles.scss';

class Page extends PureComponent {
  render() {
    const {
      analysis,
      handleShowMenu,
      mapSettings: { hidePanels }
    } = this.props;

    return (
      <div className="l-map">
        <MapMenu toggleMenu={handleShowMenu} hidePanels={hidePanels} />
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

Page.propTypes = {
  analysis: PropTypes.object,
  handleShowMenu: PropTypes.func,
  mapSettings: PropTypes.object
};

export default Page;
