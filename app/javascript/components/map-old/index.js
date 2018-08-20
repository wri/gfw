import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import difference from 'lodash/difference';
import findIndex from 'lodash/findIndex';

import Layers from './assets/layers';
import GFWdefault from './assets/maptypes/GFWdefault';
import GFWLabels from './assets/maptypes/GFWLabels';

import MapComponent from './component';
import actions from './actions';
import reducers, { initialState } from './reducers';
import { getLayers } from './selectors';

const mapStateToProps = ({ map, countryData, widgets }, { widgetKey }) => {
  const widget = widgets[widgetKey];
  const widgetSettings = widget && widget.settings;
  const activeLayers = widgetSettings && widgetSettings.layers;

  return {
    ...map,
    ...countryData.geostore,
    loading: map.loading || countryData.isGeostoreLoading,
    settings: { ...map.settings, ...widgetSettings },
    layers: getLayers({ layers: activeLayers, layerSpec: map.layerSpec }),
    layersKeys: activeLayers
  };
};

class MapContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.runningLayers = [];
  }

  componentDidMount() {
    const { layersKeys, getLayerSpec } = this.props;
    getLayerSpec();
    this.buildMap();
    this.setLayers(layersKeys);
  }

  componentWillReceiveProps(nextProps) {
    const { bounds, layersKeys, settings, options, geojson } = nextProps;
    const { zoom } = options;
    // sync geostore with map
    if (!isEmpty(bounds) && !isEqual(bounds, this.props.bounds)) {
      this.boundMap(bounds);
      this.setAreaHighlight(geojson);
    } else if (!bounds && !isEqual(bounds, this.props.bounds)) {
      this.resetMap();
    }

    // sync layers with map
    if (
      !isEqual(layersKeys, this.props.layersKeys) ||
      !isEqual(settings, this.props.settings)
    ) {
      this.updateLayers(layersKeys, this.props.layersKeys, settings);
    }

    // sync zoom with map
    if (
      zoom &&
      this.props.options.zoom !== zoom &&
      this.map.getZoom() !== zoom
    ) {
      this.map.setZoom(zoom);
    }
  }

  buildMap() {
    const { options } = this.props;
    this.map = new google.maps.Map(document.getElementById('map'), options); // eslint-disable-line
    this.map.mapTypes.set('GFWdefault', GFWdefault());
    this.map.setMapTypeId(options.mapTypeId);
    this.map.overlayMapTypes.setAt(10, GFWLabels());
  }

  boundMap(bounds) {
    const { setMapZoom } = this.props;
    const boundsMap = new google.maps.LatLngBounds(); // eslint-disable-line
    bounds.forEach(item => {
      boundsMap.extend(new google.maps.LatLng(item[1], item[0])); // eslint-disable-line
    });
    this.map.fitBounds(boundsMap);
    setMapZoom({ value: this.map.getZoom() });
  }

  removeDataLayers() {
    this.map.data.forEach(feature => {
      this.map.data.remove(feature);
    });
  }

  resetMap() {
    const { setMapZoom } = this.props;
    const { center, zoom } = initialState.options;
    setMapZoom({ value: zoom });
    this.map.setCenter(center);
    this.removeDataLayers();
  }

  setAreaHighlight(geojson) {
    this.removeDataLayers();
    this.map.data.addGeoJson(geojson);
    this.map.data.setStyle({
      strokeWeight: 1.5,
      stroke: '#333',
      fillColor: 'transparent'
    });
  }

  updateLayers(newLayers, oldLayers, settings) {
    const layersToRemove = difference(oldLayers, newLayers);
    if (layersToRemove && layersToRemove.length) {
      this.removeLayers(layersToRemove);
    }
    this.setLayers(newLayers, settings);
  }

  removeLayers(layers) {
    this.map.overlayMapTypes.forEach((l, index) => {
      if (l && l.options && layers.indexOf(l.options.slug)) {
        this.map.overlayMapTypes.removeAt(index);
      }
    });
  }

  setLayers = (layers, settings) => {
    const { layerSpec } = this.props;
    if (layers && layers.length) {
      layers.forEach((slug, index) => {
        const layerSettings = { ...layerSpec[slug], ...settings };
        const newLayer = new Layers[slug](this.map, layerSettings);
        newLayer.getLayer().then(res => {
          const runningLayerIndex = findIndex(
            this.runningLayers,
            d => d.slug === slug
          );
          if (
            runningLayerIndex !== -1 &&
            this.runningLayers[runningLayerIndex].layer.updateTiles
          ) {
            const { layer } = this.runningLayers[runningLayerIndex];
            layer.setOptions(res.options);
            if (layer.updateTilesEnable) {
              layer.updateTiles();
            } else {
              this.setRunningLayer(index, slug, res);
            }
          } else {
            this.setRunningLayer(index, slug, res);
          }
        });
      });
    }
  };

  setRunningLayer = (index, slug, layer) => {
    this.runningLayers[index] = {
      slug,
      layer
    };
    this.map.overlayMapTypes.setAt(index, this.runningLayers[index].layer);
  };

  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
}

MapContainer.propTypes = {
  layerSpec: PropTypes.object.isRequired,
  bounds: PropTypes.array,
  layersKeys: PropTypes.array,
  settings: PropTypes.object,
  options: PropTypes.object,
  getLayerSpec: PropTypes.func.isRequired,
  setMapZoom: PropTypes.func.isRequired,
  geojson: PropTypes.object
};

export { reducers, initialState, actions };

export default connect(mapStateToProps, actions)(MapContainer);
