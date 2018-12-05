import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { track } from 'utils/analytics';

import { LayerManager, Layer } from 'layer-manager/lib/react';
import { PluginLeaflet } from 'layer-manager/lib';

class LayerManagerComponent extends PureComponent {
  render() {
    const {
      layers,
      geostore,
      tileGeoJSON,
      setRecentImagerySettings,
      setMapLoading,
      handleShowTooltip,
      handleRecentImageryTooltip,
      handleMapInteraction,
      draw,
      map
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
                body: geostore.data,
                options: {
                  style: {
                    stroke: true,
                    color: '#4a4a4a',
                    weight: 2,
                    fill: false
                  }
                }
              }}
            />
          )}
        {tileGeoJSON && (
          <Layer
            id="recentImagery"
            name="Geojson"
            provider="leaflet"
            layerConfig={{
              type: 'geoJSON',
              body: tileGeoJSON,
              options: {
                style: {
                  stroke: false,
                  fillOpacity: 0
                }
              }
            }}
            interactivity
            events={{
              click: () => {
                if (!draw) {
                  setRecentImagerySettings({ visible: true });
                  track('recentImageryOpen');
                }
              },
              mouseover: e => {
                if (!draw) handleRecentImageryTooltip(e);
              },
              mouseout: () => {
                if (!draw) handleShowTooltip(false, {});
              }
            }}
          />
        )}
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
  error: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object,
  handleMapMove: PropTypes.func,
  bboxs: PropTypes.object,
  recentImagery: PropTypes.bool,
  recentTileBounds: PropTypes.array,
  setRecentImagerySettings: PropTypes.func,
  geostore: PropTypes.object,
  tileGeoJSON: PropTypes.object,
  query: PropTypes.object,
  tooltipData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  bbox: PropTypes.array,
  showTooltip: PropTypes.bool,
  handleShowTooltip: PropTypes.func,
  setMapLoading: PropTypes.func,
  handleRecentImageryTooltip: PropTypes.func,
  handleMapInteraction: PropTypes.func,
  analysisActive: PropTypes.bool,
  oneClickAnalysisActive: PropTypes.bool,
  draw: PropTypes.bool,
  embed: PropTypes.bool,
  map: PropTypes.object
};

export default LayerManagerComponent;
