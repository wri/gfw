import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { LayerManager, Layer } from 'layer-manager/dsit/components';
import { PluginLeaflet } from 'layer-manager';

class LayerManagerComponent extends PureComponent {
  render() {
    const {
      layers,
      geostore,
      setMapLoading,
      draw,
      map,
      customLayers,
      handleMapInteraction
    } = this.props;

    return (
      <LayerManager
        map={map}
        plugin={PluginLeaflet}
        onLayerLoading={loading => setMapLoading(loading)}
      >
        {geostore &&
          geostore.id && (
            <Layer
              id="geostore"
              name="Geojson"
              provider="leaflet"
              layerConfig={{
                id: geostore.id,
                type: 'geoJSON',
                body: geostore.geojson,
                options: {
                  style: {
                    stroke: true,
                    color: '#4a4a4a',
                    weight: 2,
                    fill: false
                  }
                }
              }}
              zIndex={1090}
            />
          )}
        {customLayers &&
          customLayers.length &&
          customLayers.map(l => <Layer key={l.id} {...l} />)}
        {layers &&
          layers.map(l => {
            const { interactionConfig } = l;
            const { output, article } = interactionConfig || {};
            const layer = {
              ...l,
              ...(!isEmpty(output) && {
                interactivity: output.map(i => i.column),
                events: {
                  click: e => {
                    if (!draw) {
                      handleMapInteraction({
                        e,
                        layer: l,
                        article,
                        output
                      });
                    }
                  }
                }
              })
            };

            return <Layer key={l.id} {...layer} />;
          })}
      </LayerManager>
    );
  }
}

LayerManagerComponent.propTypes = {
  loading: PropTypes.bool,
  layers: PropTypes.array,
  geostore: PropTypes.object,
  setMapLoading: PropTypes.func,
  handleMapInteraction: PropTypes.func,
  draw: PropTypes.bool,
  map: PropTypes.object,
  customLayers: PropTypes.array
};

export default LayerManagerComponent;
