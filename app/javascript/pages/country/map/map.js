import { createElement } from 'react';
import { connect } from 'react-redux';

import { getLayerSpec } from 'services/layer-spec';

import MapComponent from './map-component';
import actions from './map-actions';

export { initialState } from './map-reducers';
export { default as reducers } from './map-reducers';
export { default as actions } from './map-actions';

const mapStateToProps = state => ({
  bounds: state.root.geostore.bounds,
  isLoading: state.map.isLoading,
  zoom: state.map.zoom,
  maptype: state.map.maptype,
  layerSpec: state.map.layerSpec,
  layers: state.map.layers
});

const MapContainer = props => {
  const setInitialData = () => {
    const { setLayerSpec, setMapIsLoading } = props;
    setMapIsLoading(true);
    getLayerSpec().then(response => {
      const layerSpec = {};
      response.data.rows.forEach(layer => {
        layerSpec[layer.slug] = layer;
      });

      setLayerSpec(layerSpec);
      setMapIsLoading(false);
    });
  };

  return createElement(MapComponent, {
    ...props,
    setInitialData
  });
};

export default connect(mapStateToProps, actions)(MapContainer);
