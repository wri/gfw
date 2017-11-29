import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layers from 'map/layers';
import grayscale from 'map/maptypes/grayscale';
import isEqual from 'lodash/isEqual';

import MapComponent from './map-component';
import actions from './map-actions';

export { initialState } from './map-reducers';
export { default as reducers } from './map-reducers';
export { default as actions } from './map-actions';

const mapStateToProps = state => ({
  isLoading: state.map.isLoading,
  isGeostoreLoading: state.countryData.isGeostoreLoading,
  bounds: state.countryData.geostore.bounds,
  layersSpec: state.map.layersSpec,
  layers: state.map.layers
});

class MapContainer extends PureComponent {
  componentDidMount() {
    this.buildMap(this.props);
    this.props.getLayersSpec();
  }

  componentWillReceiveProps(nextProps) {
    const { isGeostoreLoading, bounds, layers, layersSpec } = nextProps;
    if (isGeostoreLoading !== this.props.isGeostoreLoading && bounds) {
      this.boundMap(nextProps.bounds);
    }

    if (!isEqual(layersSpec, this.props.layersSpec) && layers.length) {
      this.updateLayers(layers, layersSpec);
    }
  }

  setLayers(layers, layersSpec) {
    layers.forEach((slug, index) => {
      const layer = new Layers[slug](this.map, { layerSpec: layersSpec[slug] });
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

  updateLayers(layers, layersSpec) {
    this.removeLayers();
    this.setLayers(layers, layersSpec);
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
  isGeostoreLoading: PropTypes.bool.isRequired,
  layersSpec: PropTypes.object.isRequired,
  bounds: PropTypes.array.isRequired,
  layers: PropTypes.array.isRequired,
  mapOptions: PropTypes.object.isRequired,
  getLayersSpec: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(MapContainer);
