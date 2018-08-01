import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import MapComponent from './map-component';
import actions from './map-actions';
import { getMapProps } from './map-selectors';

const mapStateToProps = (
  { countryData, widgets, location, datasets },
  { widgetKey }
) => {
  const widget = widgetKey ? widgets[widgetKey] : null;
  const widgetSettings = widget && widget.settings;

  return {
    ...countryData.geostore,
    ...getMapProps({
      ...location,
      widgetSettings,
      ...datasets
    })
  };
};

class MapContainer extends PureComponent {
  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
  // missing fit to bound from geostore, reset map, area highlight
}

MapContainer.defaultProps = {
  zoomControl: false,
  center: [27, 12],
  zoom: 3,
  tileLayer: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
  labelLayer:
    'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
  maxZoom: 19,
  minZoom: 2,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
};

export { actions };

export default connect(mapStateToProps, actions)(MapContainer);
