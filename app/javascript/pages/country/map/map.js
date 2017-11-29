import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Layers from 'map/layers';
import grayscale from 'map/maptypes/grayscale';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';

import MapComponent from './map-component';
import actions from './map-actions';

export { initialState } from './map-reducers';
export { default as reducers } from './map-reducers';
export { default as actions } from './map-actions';

const mapStateToProps = state => ({
  bounds: state.countryData.geostore.bounds,
  isLoading: state.map.isLoading,
  isGeostoreLoading: state.countryData.isGeostoreLoading,
  zoom: state.map.zoom,
  maptype: state.map.maptype,
  layerSpec: state.map.layerSpec,
  layers: state.map.layers
});

class MapContainer extends PureComponent {
  componentDidMount() {
    this.buildMap(this.props);
    this.props.getLayers();
  }

  componentWillReceiveProps(nextProps) {
    const { isGeostoreLoading, bounds, layers, layerSpec } = nextProps;
    if (isGeostoreLoading !== this.props.isGeostoreLoading && bounds) {
      this.boundMap(nextProps.bounds);
    }

    if (
      !isEqual(layers, this.props.layers) ||
      (!isEqual(layerSpec, this.props.layerSpec) && !isEmpty(layers))
    ) {
      this.updateLayers(layers);
    }
  }

  setLayers(layers) {
    const { layerSpec } = this.props;
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

  updateLayers(layers) {
    this.removeLayers();
    this.setLayers(layers);
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
  layerSpec: PropTypes.object.isRequired,
  bounds: PropTypes.array.isRequired,
  layers: PropTypes.array.isRequired,
  mapOptions: PropTypes.object.isRequired,
  getLayers: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(MapContainer);
