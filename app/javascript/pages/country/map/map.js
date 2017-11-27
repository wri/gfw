import { createElement } from 'react';
import { connect } from 'react-redux';

import { getLayerSpec } from 'services/layer-spec';

import MapComponent from './map-component';
import actions from './map-actions';

export { initialState } from './map-reducers';
export { default as reducers } from './map-reducers';
export { default as actions } from './map-actions';

const mapStateToProps = state => ({
  zoom: state.map.zoom,
  bounds: state.root.countryData.bounds,
  admin1: state.root.admin1,
  regionBounds: state.root.admin1List[state.root.admin1].bounds,
  maptype: state.map.maptype,
  layerSpec: state.map.layerSpec,
  layers: state.map.layers
});

const MapContainer = props => {
  const setMapData = () => {
    getLayerSpec().then(response => {
      const layerSpec = {};
      response.data.rows.forEach(layer => {
        layerSpec[layer.slug] = layer;
      });

      props.setLayerSpec(layerSpec);
    });
  };

  return createElement(MapComponent, {
    ...props,
    setMapData
  });
};

export default connect(mapStateToProps, actions)(MapContainer);
