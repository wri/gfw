import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Layers from './assets/layers';
import grayscale from './assets/maptypes/grayscale';

import MapComponent from './map-component';
import actions from './map-actions';

export { initialState } from './map-reducers';
export { default as reducers } from './map-reducers';
export { default as actions } from './map-actions';

const mapStateToProps = ({ map, countryData }, { isParentLoading }) => ({
  loading: map.loading || isParentLoading,
  error: map.error,
  bounds: countryData.geostore.bounds,
  layerSpec: map.layerSpec,
  layers: map.layers
});

class MapContainer extends PureComponent {
  componentDidMount() {
    this.buildMap(this.props);
    this.props.getLayerSpec();
  }

  componentWillReceiveProps(nextProps) {
    const { isParentLoading, bounds, layers, layerSpec } = nextProps;
    if (isParentLoading !== this.props.isParentLoading && bounds) {
      this.boundMap(nextProps.bounds);
    }

    if (!isEqual(layerSpec, this.props.layerSpec) && layers.length) {
      this.updateLayers(layers, layerSpec);
    }
  }

  setLayers(layers, layerSpec) {
    layers.forEach((slug, index) => {
      const layer = new Layers[slug](this.map, { layerSpec: layerSpec[slug] });
      layer.getLayer().then(res => {
        this.map.overlayMapTypes.setAt(index, res);
      });
    });
  }

  removeLayers() {
    const { layers } = this.props;
    layers.forEach((slug, index) => {
      this.map.overlayMapTypes.setAt(index, null);
    });
  }

  updateLayers(layers, layerSpec) {
    this.removeLayers();
    this.setLayers(layers, layerSpec);
  }

  buildMap() {
    const { mapOptions } = this.props;
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions); // eslint-disable-line
    this.map.mapTypes.set('grayscale', grayscale());
    this.map.setMapTypeId(mapOptions.mapTypeId);
  }

  boundMap() {
    const { bounds } = this.props;
    const boundsMap = new google.maps.LatLngBounds(); // eslint-disable-line
    bounds.forEach(item => {
      boundsMap.extend(new google.maps.LatLng(item[1], item[0])); // eslint-disable-line
    });
    this.map.fitBounds(boundsMap);
  }

  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
}

MapContainer.propTypes = {
  isParentLoading: PropTypes.bool,
  layerSpec: PropTypes.object.isRequired,
  bounds: PropTypes.array.isRequired,
  layers: PropTypes.array.isRequired,
  mapOptions: PropTypes.object.isRequired,
  getLayerSpec: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(MapContainer);
