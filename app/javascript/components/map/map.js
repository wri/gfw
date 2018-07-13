import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import MapComponent from './map-component';
import actions from './map-actions';
import { getMapProps } from './map-selectors';

const L = window.L;

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
  componentDidMount() {
    this.initMap();
    this.initBasemap();
  }

  initMap = () => {
    this.map = L.map('c-map', {
      ...this.props
    }).setView([27, 12], 3);
  };

  initBasemap = () => {
    const { tileLayer, labelLayer, maxZoom, attribution } = this.props;

    L.tileLayer(tileLayer, {
      maxZoom,
      attribution
    }).addTo(this.map);

    L.tileLayer(labelLayer, {
      maxZoom,
      attribution
    })
      .addTo(this.map)
      .setZIndex(1001);
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      map: this.map
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

MapContainer.propTypes = {
  tileLayer: PropTypes.string,
  labelLayer: PropTypes.string,
  maxZoom: PropTypes.number,
  attribution: PropTypes.string
};

export { actions };

export default connect(mapStateToProps, actions)(MapContainer);
