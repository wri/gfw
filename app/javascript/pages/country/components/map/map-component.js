import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

class Map extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      options: Object.assign({}, props.mapOptions, {
        zoom: this.props.zoom,
        center: { lat: this.props.center.latitude, lng: this.props.center.longitude },
        maxZoom: this.props.maxZoom,
        minZoom: this.props.minZoom
      })
    };
  }

  componentDidMount() {
    this.map = new google.maps.Map(document.getElementById('map'), this.state.options);
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
