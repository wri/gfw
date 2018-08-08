import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import MapComponent from './map-component';
import actions from './map-actions';
import { getMapProps } from './map-selectors';

const mapStateToProps = (
  { countryData, widgets, location, datasets },
  { widgetKey }
) => ({
  ...getMapProps({
    ...countryData,
    ...location,
    ...datasets,
    ...widgets,
    widgetKey
  })
});

class MapContainer extends PureComponent {
  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
}

MapContainer.defaultProps = {
  mapOptions: {
    center: [27, 12],
    zoom: 3,
    zoomControl: false,
    maxZoom: 19,
    minZoom: 2,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  basemap: {
    url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
  },
  label: {
    url: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png'
  }
};

export { actions };

export default connect(mapStateToProps, actions)(MapContainer);
