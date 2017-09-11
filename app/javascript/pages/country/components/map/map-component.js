import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

class Map extends PureComponent {
  componentDidMount() {
    const mapDefaultOptions = {
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      zoom: this.props.zoom,
      center: { lat: this.props.center.latitude, lng: this.props.center.longitude },
      mapTypeId: google.maps.MapTypeId.HYBRID,
      maxZoom: this.props.maxZoom,
      minZoom: this.props.minZoom
    };

    this.map = new google.maps.Map(document.getElementById('map'), mapDefaultOptions);
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      this.onMapInit();
    });
  }

  onMapInit() {
    console.log('onMapInit');
  }

  render() {
    return (
      <div
        id="map"
      />
    )
  }
}

Map.propTypes = {
  zoom: Proptypes.number,
  center: Proptypes.object,
  maxZoom: Proptypes.number,
  minZoom: Proptypes.number,
};

Map.defaultProps = {
  zoom: 1,
  center: {
    latitude: 0,
    longitude: 20
  },
  maxZoom: 14,
  minZoom: 1
};

export default Map;
