import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import { Map } from 'wri-api-components';

import { LayerManager, Layer } from 'layer-manager/dist/react';
import { PluginLeaflet } from 'layer-manager';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';

import './map-styles.scss';

class MapComponent extends PureComponent {
  render() {
    const { loading, error, activeLayers } = this.props;

    return (
      <React.Fragment>
        <Map>
          {map => (
            <LayerManager map={map} plugin={PluginLeaflet}>
              {activeLayers &&
                activeLayers.map(l => <Layer key={l.id} {...l} />)}
            </LayerManager>
          )}
        </Map>
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
      </React.Fragment>
    );
  }
}

MapComponent.propTypes = {
  loading: Proptypes.bool,
  activeLayers: Proptypes.array,
  error: Proptypes.bool,
  map: Proptypes.object
};

export default MapComponent;
