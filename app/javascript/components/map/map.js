import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import Layers from './assets/layers';
import GFWdefault from './assets/maptypes/GFWdefault';

import MapComponent from './map-component';
import actions from './map-actions';
import { getLayers } from './map-selectors';

export { initialState } from './map-reducers';
export { default as reducers } from './map-reducers';
export { default as actions } from './map-actions';

const mapStateToProps = (
  state,
  { isParentLoading, layers, parentLayersKey }
) => {
  const { map, countryData } = state;
  const parentSettings =
    state[parentLayersKey] && state[parentLayersKey].settings;
  const activeLayers =
    layers || (parentSettings && parentSettings.layers) || map.layers;
  return {
    loading: map.loading || isParentLoading,
    error: map.error,
    bounds: countryData.geostore.bounds,
    layerSpec: map.layerSpec,
    settings: map.settings,
    layers: getLayers({ layers: activeLayers, layerSpec: map.layerSpec }),
    layersKeys: activeLayers
  };
};

class MapContainer extends PureComponent {
  componentDidMount() {
    const { mapOptions, getLayerSpec, setMapSettings } = this.props;
    this.buildMap();
    getLayerSpec();
    setMapSettings(mapOptions);
  }

  componentWillReceiveProps(nextProps) {
    const { isParentLoading, bounds, layersKeys, settings } = nextProps;
    if (isParentLoading !== this.props.isParentLoading && bounds) {
      this.boundMap(nextProps.bounds);
      this.setAreaHighlight();
      this.updateLayers(layersKeys);
      this.setEvents();
    }

    if (!isEqual(layersKeys, this.props.layersKeys)) {
      this.updateLayers(layersKeys);
    }

    if (
      this.props.settings.zoom &&
      this.props.settings.zoom !== settings.zoom
    ) {
      this.updateZoom(settings.zoom);
    }
  }

  setLayers = (layers, settings) => {
    const { layerSpec } = this.props;
    if (layers && layers.length) {
      layers.forEach((slug, index) => {
        const layerSettings = { ...layerSpec[slug], ...settings };
        const layer = new Layers[slug](this.map, layerSettings);
        layer.getLayer().then(res => {
          this.map.overlayMapTypes.setAt(index, res);
        });
      });
    }
  };

  setAreaHighlight() {
    const { setMapZoom } = this.props;

    this.map.data.forEach(feature => {
      this.map.data.remove(feature);
    });
    const { areaHighlight } = this.props;
    this.map.data.addGeoJson(areaHighlight);
    this.map.data.setStyle({
      strokeWeight: 1.5,
      stroke: '#333',
      fillColor: 'transparent'
    });
    setMapZoom({
      value: this.map.getZoom(),
      sum: false
    });
  }

  setEvents() {
    this.map.addListener('zoom_changed', () => {
      const { setMapZoom } = this.props;
      setMapZoom({
        value: this.map.getZoom(),
        sum: false
      });
    });
  }

  removeLayers() {
    const { layers } = this.props;
    if (layers && layers.length) {
      layers.forEach((slug, index) => {
        this.map.overlayMapTypes.setAt(index, null);
      });
    }
  }

  updateLayers(layers, layerSpec) {
    this.removeLayers();
    this.setLayers(layers, layerSpec);
  }

  updateZoom(zoom) {
    this.map.setZoom(zoom);
  }

  buildMap() {
    const { mapOptions } = this.props;
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions); // eslint-disable-line
    this.map.mapTypes.set('GFWdefault', GFWdefault());
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
  layers: PropTypes.array,
  layersKeys: PropTypes.array,
  settings: PropTypes.object,
  mapOptions: PropTypes.object.isRequired,
  getLayerSpec: PropTypes.func.isRequired,
  setMapZoom: PropTypes.func.isRequired,
  setMapSettings: PropTypes.func.isRequired,
  areaHighlight: PropTypes.object
};

export default connect(mapStateToProps, actions)(MapContainer);
