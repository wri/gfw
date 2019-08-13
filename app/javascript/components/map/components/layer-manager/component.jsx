import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';

class LayerManagerComponent extends PureComponent {
  render() {
    const { layers, geostore, setMapLoading, basemap, map, isAoI } = this.props;

    return (
      <LayerManager
        map={map}
        plugin={PluginMapboxGl}
        onLayerLoading={loading => setMapLoading(loading)}
      >
        {geostore &&
          geostore.id && (
          <Layer
            id={geostore.id}
            name="Geojson"
            provider="geojson"
            layerConfig={{
              data: geostore.geojson,
              body: {
                vectorLayers: [
                  {
                    type: 'fill',
                    paint: {
                      'fill-color': 'transparent'
                    }
                  },
                  {
                    type: 'line',
                    paint: {
                      'line-color': '#C0FF24',
                      'line-width': isAoI ? 3 : 1,
                      'line-offset': isAoI ? 2 : 0
                    }
                  },
                  {
                    type: 'line',
                    paint: {
                      'line-color': '#000',
                      'line-width': 2
                    }
                  }
                ]
              }
            }}
            zIndex={1060}
          />
        )}
        {layers && layers.map(l => <Layer key={l.id} {...l} />)}
        {basemap &&
          basemap.url && (
          <Layer
            id="basemap"
            name="Basemap"
            provider="leaflet"
            layerConfig={{
              body: {
                url: basemap.url
              }
            }}
            zIndex={100}
          />
        )}
      </LayerManager>
    );
  }
}

LayerManagerComponent.propTypes = {
  loading: PropTypes.bool,
  layers: PropTypes.array,
  isAoI: PropTypes.bool,
  basemap: PropTypes.object,
  geostore: PropTypes.object,
  setMapLoading: PropTypes.func,
  map: PropTypes.object
};

export default LayerManagerComponent;
