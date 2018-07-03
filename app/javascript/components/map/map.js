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

import MapComponent from './map-component';
import actions from './map-actions';
import initialState from './map-initial-state';
import { getLayers, getMapSettings } from './map-selectors';

const mapStateToProps = (
  { countryData, widgets, location, datasets, layerSpec },
  { widgetKey }
) => {
  const widget = widgetKey ? widgets[widgetKey] : null;
  const widgetSettings = widget && widget.settings;
  const mapSettings = getMapSettings(location);
  const activeLayers =
    (widgetSettings && widgetSettings.layers) || mapSettings.layers;

  return {
    ...countryData.geostore,
    layerSpec: layerSpec.data,
    loading: datasets.loading,
    defaultSettings: initialState,
    settings: mapSettings,
    layers: getLayers({ layers: activeLayers, layerSpec: layerSpec.data }),
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
    const { bounds, layersKeys, settings, geojson } = nextProps;
    const { zoom } = settings;
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
      this.props.settings.zoom !== zoom &&
      this.map.getZoom() !== zoom
    ) {
      this.map.setZoom(zoom);
    }
  }

  buildMap() {
    const { settings } = this.props;
    this.map = new google.maps.Map(document.getElementById('map'), settings); // eslint-disable-line
    this.map.mapTypes.set('GFWdefault', GFWdefault());
    this.map.setMapTypeId(settings.mapTypeId);
    this.map.overlayMapTypes.setAt(10, GFWLabels());
  }

  boundMap(bounds) {
    const { setMapSettings } = this.props;
    const boundsMap = new google.maps.LatLngBounds(); // eslint-disable-line
    bounds.forEach(item => {
      boundsMap.extend(new google.maps.LatLng(item[1], item[0])); // eslint-disable-line
    });
    this.map.fitBounds(boundsMap);
    setMapSettings({ zoom: this.map.getZoom() });
  }

  removeDataLayers() {
    this.map.data.forEach(feature => {
      this.map.data.remove(feature);
    });
  }

  resetMap() {
    const { setMapSettings, defaultSettings } = this.props;
    const { center, zoom } = defaultSettings;
    setMapSettings({ zoom });
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
      if (l && l.settings && layers.indexOf(l.settings.slug)) {
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
  bounds: PropTypes.array,
  layersKeys: PropTypes.array,
  layerSpec: PropTypes.object,
  settings: PropTypes.object,
  getLayerSpec: PropTypes.func.isRequired,
  setMapSettings: PropTypes.func.isRequired,
  geojson: PropTypes.object,
  defaultSettings: PropTypes.object
};

export { actions };

export default connect(mapStateToProps, actions)(MapContainer);
