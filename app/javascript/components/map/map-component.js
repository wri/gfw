import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'wri-api-components';

import { LayerManager } from 'layer-manager/dist/react';
import { PluginLeaflet } from 'layer-manager';

import Loader from 'components/ui/loader';
import NoContent from 'components/ui/no-content';
import Popup from './components/popup';

import './map-styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
    });
  }

  render() {
    const {
      loading,
      error,
      activeLayers,
      mapOptions,
      basemap,
      label
    } = this.props;

    return (
      <Fragment>
        <Map
          customClass="c-map"
          onReady={map => {
            this.map = map;
          }}
          mapOptions={mapOptions}
          basemap={basemap}
          label={label}
        >
          {map => (
            <Fragment>
              <LayerManager
                map={map}
                plugin={PluginLeaflet}
                layersSpec={activeLayers}
              />
              <Popup map={map} />
            </Fragment>
          )}
        </Map>
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        {!loading &&
          error && (
            <NoContent message="An error occured. Please try again later." />
          )}
      </Fragment>
    );
  }
}

MapComponent.propTypes = {
  loading: PropTypes.bool,
  activeLayers: PropTypes.array,
  error: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object
};

export default MapComponent;
