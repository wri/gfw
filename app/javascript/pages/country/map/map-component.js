import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Layers from 'map/layers';
import grayscale from 'map/maptypes/grayscale';

class Map extends PureComponent {
  componentDidMount() {
    const {
      setMapData,
      mapOptions,
      zoom,
      maptype,
      maxZoom,
      minZoom,
      bounds,
      regionBounds,
      region
    } = this.props;

    setMapData(this.props);

    const coordsMap = region === 0 ? bounds : JSON.parse(regionBounds);
    const boundsMap = new google.maps.LatLngBounds();
    for (let i = 0; i < coordsMap.coordinates[0].length; i += 1) {
      boundsMap.extend(
        new google.maps.LatLng(
          coordsMap.coordinates[0][i][1],
          coordsMap.coordinates[0][i][0]
        )
      );
    }
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
    this.map = new google.maps.Map(document.getElementById('map'), options);
    this.map.fitBounds(boundsMap);
    this.setMaptypes();
    this.setMaptypeId(maptype);
    this.setListeners();
  }

  componentWillUpdate(nextProps) {
    const oldLayers = this.props.layers;
    const newLayers = nextProps.layers;
    const sameLayers =
      oldLayers.length === newLayers.length &&
      oldLayers.every((element, index) => element === newLayers[index]);

    if (!sameLayers) {
      this.updateLayers(newLayers);
    }
  }

  setListeners() {
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.onMapInit();
    });
  }

  onMapInit() {
    const { layers } = this.props;
    this.setLayers(layers);
  }

  setMaptypes() {
    this.map.mapTypes.set('grayscale', grayscale());
  }

  setMaptypeId(maptype) {
    this.map.setMapTypeId(maptype);
  }

  updateLayers(layers) {
    this.removeLayers();
    this.setLayers(layers);
  }

  removeLayers() {
    const { layers } = this.props;

    layers.map((slug, index) => {
      this.map.overlayMapTypes.setAt(index, null);
    });
  }

  setLayers(layers) {
    const { layerSpec } = this.props;

    layers.map((slug, index) => {
      const layer = new Layers[slug](this.map, { layerSpec: layerSpec[slug] });
      layer.getLayer().then(res => {
        this.map.overlayMapTypes.setAt(index, res);
      });
    });
  }

  render() {
    return (
      <div id="map" className={`c-map ${this.props.fixed ? '-fixed' : ''}`} />
    );
  }
}

Map.propTypes = {
  setMapData: Proptypes.func.isRequired,
  zoom: Proptypes.number.isRequired,
  maptype: Proptypes.string.isRequired,
  layers: Proptypes.array.isRequired,
  maxZoom: Proptypes.number.isRequired,
  minZoom: Proptypes.number.isRequired,
  bounds: Proptypes.object.isRequired,
  regionBounds: Proptypes.string.isRequired,
  region: Proptypes.number.isRequired,
  layerSpec: Proptypes.object.isRequired,
  mapOptions: Proptypes.object
};

Map.defaultProps = {
  mapOptions: {}
};

export default Map;
