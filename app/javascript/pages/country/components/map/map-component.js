import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Layers from '../../../../utils/layers';

class Map extends PureComponent {

  componentDidMount() {
    const {
      mapOptions,
      zoom,
      center,
      maxZoom,
      minZoom
    } = this.props;

    const options = {
      options: Object.assign({}, mapOptions, {
        zoom: zoom,
        center: { lat: center.latitude, lng: center.longitude },
        maxZoom: maxZoom,
        minZoom: minZoom
      })
    };
    this.map = new google.maps.Map(document.getElementById('map'), options);

    this.setListeners();
  }

  componentWillUpdate(nextProps) {
    console.log(nextProps);
  }

  setListeners() {
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.onMapInit();
    });
  }

  onMapInit() {
    const {
      layers
    } = this.props;

    this.setLayers(layers);
  }

  setLayers(layers) {
    layers.map((layer, index) => {
      this.map.overlayMapTypes.setAt(index, new Layers[layer](this.map, {}));
    });
  }

  render() {
    return (
      <div
        id="map"
        className="c-map"
      />
    )
  }
}

Map.propTypes = {
  zoom: Proptypes.number.isRequired,
  center: Proptypes.object.isRequired,
  maxZoom: Proptypes.number.isRequired,
  minZoom: Proptypes.number.isRequired,
  mapOptions: Proptypes.object
};

Map.defaultProps = {
  mapOptions: {}
};

export default Map;
