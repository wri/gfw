import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import CountryDataProvider from 'providers/country-data-provider';
import Map from 'components/map';
import MapMenu from 'pages/map/menu';
import ModalMeta from 'components/modals/meta';
import Share from 'components/modals/share';
import MapControls from 'components/map/components/map-controls';

import './page-styles.scss';

class Page extends PureComponent {
  render() {
    const { setMapZoom } = this.props;
    return (
      <div className="l-map">
        <CountryDataProvider />
        <Map activeWidget={null} />
        <MapMenu />
        <MapControls
          className="map-controls"
          handleZoomIn={() => setMapZoom({ sum: 1 })}
          handleZoomOut={() => setMapZoom({ sum: -1 })}
        />
        <Share />
        <ModalMeta />
      </div>
    );
  }
}

Page.propTypes = {
  setMapZoom: Proptypes.bool.isRequired
};

export default Page;
