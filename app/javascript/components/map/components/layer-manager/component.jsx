import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl, fetch } from 'layer-manager';

class LayerManagerComponent extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    layers: PropTypes.array,
    basemap: PropTypes.object,
    setMapLoading: PropTypes.func,
    map: PropTypes.object
  };

  render() {
    const { layers, /* setMapLoading, */ basemap, map } = this.props;

    const basemapLayer =
      basemap && basemap.url
        ? {
          id: basemap.url,
          name: 'Basemap',
          provider: 'leaflet',
          layerConfig: {
            source: {
              url: basemap.url
            }
          },
          zIndex: 100
        }
        : null;

    const allLayers = [basemapLayer].concat(layers).filter(l => l);

    return (
      <LayerManager
        map={map}
        plugin={PluginMapboxGl}
        // onLayerLoading={loading => setMapLoading(loading)} // removed in LMv3
        providers={{
          stories: (layerModel, layer, resolve, reject) => {
            const { source } = layerModel;
            const { provider } = source;

            fetch('get', provider.url, provider.options, layerModel)
              .then(response => resolve({
                ...layer,
                source: {
                  ...omit(layer.source, 'provider'),
                  data: {
                    type: 'FeatureCollection',
                    features: response.rows.map(r => ({
                      type: 'Feature',
                      properties: r,
                      geometry: {
                        type: 'Point',
                        coordinates: [r.lon, r.lat]
                      }
                    }))
                  }
                }
              }))
              .catch(e => {
                reject(e);
              });
          }
        }}
      >
        {allLayers &&
          allLayers.map(l => <Layer key={l.id} {...l} {...l.layerConfig} />)}
      </LayerManager>
    );
  }
}

export default LayerManagerComponent;
