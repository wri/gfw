import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import MapComponent from './map-component';
import actions from './map-actions';
import { getMapProps } from './map-selectors';

const mapStateToProps = ({
  countryData,
  widgets,
  location,
  datasets,
  geostore
}) => ({
  ...getMapProps({
    ...countryData,
    ...location,
    ...datasets,
    ...widgets,
    ...geostore
  })
});

class MapContainer extends PureComponent {
  render() {
    return createElement(MapComponent, {
      ...this.props
    });
  }
}

export { actions };

export default connect(mapStateToProps, actions)(MapContainer);
