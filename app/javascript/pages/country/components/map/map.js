import { createElement } from 'react';
import { connect } from 'react-redux';

import MapComponent from './map-component';
import actions from './map-actions';

export { initialState } from './map-reducers';
export { default as reducers } from './map-reducers';
export { default as actions } from './map-actions';

import {
  getLayerSpec
} from '../../../../services/layer-spec';

const mapStateToProps = state => ({
  zoom: state.map.zoom,
  bounds: state.root.countryData.bounds,
  region: state.root.countryRegion,
  regionBounds: state.root.countryRegions[state.root.countryRegion].bounds,
  maptype: state.map.maptype,
  layerSpec: state.map.layerSpec,
  layers: state.map.layers
});

const MapContainer = (props) => {
  const setMapData = (props) => {
    getLayerSpec()
      .then((response) => {
        let layerSpec = {};
        response.data.rows.map((layer) => {
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
