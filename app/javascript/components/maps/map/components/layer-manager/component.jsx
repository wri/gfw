import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { LayerManager, Layer } from 'layer-manager/dist/components';
import { PluginMapboxGl } from 'layer-manager';

class LayerManagerComponent extends PureComponent {
  render() {
    const {
      layers,
      geostore,
      setMapLoading,
      basemap,
      labels,
      map
    } = this.props;

    return (
      <LayerManager
        map={map}
        plugin={PluginMapboxGl}
        onLayerLoading={loading => setMapLoading(loading)}
      >
        {labels &&
          labels.url && (
            <Layer
              id="labels"
              name="Labels"
              provider="leaflet"
              layerConfig={{
                body: {
                  url: labels.url
                }
              }}
              zIndex={1100}
            />
          )}
        {geostore &&
          geostore.id && (
            <Layer
              id={geostore.id}
              name="Geojson"
              provider="geojson"
              params={{
                id: geostore.id
              }}
              layerConfig={{
                data: geostore.geojson,
                body: {
                  vectorLayers: [
                    {
                      id: `${geostore.id}-fill`,
                      type: 'fill',
                      source: geostore.id,
                      paint: {
                        'fill-color': 'transparent'
                      }
                    },
                    {
                      id: `${geostore.id}-line`,
                      type: 'line',
                      source: geostore.id,
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
      </LayerManager>
    );
  }
}

LayerManagerComponent.propTypes = {
  loading: PropTypes.bool,
  layers: PropTypes.array,
  basemap: PropTypes.object,
  geostore: PropTypes.object,
  setMapLoading: PropTypes.func,
  handleMapInteraction: PropTypes.func,
  draw: PropTypes.bool,
  map: PropTypes.object,
  labels: PropTypes.object
};

export default LayerManagerComponent;
