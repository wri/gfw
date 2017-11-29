import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Layers from 'map/layers';
import grayscale from 'map/maptypes/grayscale';

import Loader from 'components/loader/loader';

class Map extends PureComponent {
  componentDidMount() {
    const { setInitialData } = this.props;
    setInitialData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isLoading && nextProps.bounds && nextProps.layerSpec) {
      this.buildMap(nextProps);
      this.checkLayers(this.props, nextProps);
    }
  }

  onMapInit() {
    const { layers } = this.props;
    this.setLayers(layers);
  }

  setListeners() {
    google.maps.event // eslint-disable-line
      .addListenerOnce(this.map, 'idle', () => {
        this.onMapInit();
      });
  }

  setMaptypes() {
    this.map.mapTypes.set('grayscale', grayscale());
  }

  setMaptypeId(maptype) {
    this.map.setMapTypeId(maptype);
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

  buildMap(nextProps) {
    const { zoom, maptype, bounds, maxZoom, minZoom, mapOptions } = nextProps;

    const boundsMap = new google.maps.LatLngBounds(); // eslint-disable-line
    bounds.forEach(item => {
      boundsMap.extend(new google.maps.LatLng(item[1], item[0])); // eslint-disable-line
    });

    const options = {
      options: Object.assign({}, mapOptions, {
        zoom,
        center: {
          lat: boundsMap.getCenter().lat(),
          lng: boundsMap.getCenter().lng()
        },
        maxZoom,
        minZoom
      })
    };
    this.map = new google.maps.Map(document.getElementById('map'), options); // eslint-disable-line
    this.map.fitBounds(boundsMap);
    this.setMaptypes();
    this.setMaptypeId(maptype);
    this.setListeners();
    this.checkLayers(this.props, nextProps);
  }

  checkLayers(props, nextProps) {
    const oldLayers = props.layers;
    const newLayers = nextProps.layers;
    const sameLayers =
      oldLayers.length === newLayers.length &&
      oldLayers.every((element, index) => element === newLayers[index]);

    if (!sameLayers) {
      this.updateLayers(newLayers);
    }
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

  render() {
    return (
      <div id="map" className="c-map">
        <Loader isAbsolute />
      </div>
    );
  }
}

Map.propTypes = {
  isLoading: Proptypes.bool.isRequired,
  layerSpec: Proptypes.object.isRequired,
  setInitialData: Proptypes.func.isRequired,
  bounds: Proptypes.array.isRequired,
  layers: Proptypes.array.isRequired
};

Map.defaultProps = {
  mapOptions: {}
};

export default Map;
