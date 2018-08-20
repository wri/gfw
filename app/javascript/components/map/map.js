import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MapComponent from './map-component';
import actions from './map-actions';
import { getMapProps } from './map-selectors';

const mapStateToProps = (
  { countryData, widgets, location, datasets, geostore },
  { widgetKey }
) => ({
  ...getMapProps({
    ...countryData,
    ...location,
    ...datasets,
    ...widgets,
    ...geostore,
    widgetKey
  })
});

class MapContainer extends PureComponent {
  static propTypes = {
    basemap: PropTypes.object,
    mapOptions: PropTypes.object,
    setLandsatBasemap: PropTypes.func
  };

  componentDidUpdate({ mapOptions: { prevZoom } }) {
    const { basemap, mapOptions: { zoom } } = this.props;
    if (basemap.id === 'landsat' && prevZoom !== zoom) {
      this.props.setLandsatBasemap(basemap.year, basemap.defaultUrl);
    }
  }

  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
}

export { actions };

export default connect(mapStateToProps, actions)(MapContainer);
