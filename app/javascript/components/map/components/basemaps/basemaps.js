import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setMapSettings, setLandsatBasemap } from 'components/map/map-actions';
import {
  getBasemap,
  getLabels,
  getMapZoom
} from 'components/map/map-selectors';
import BasemapsComponent from './basemaps-component';

function mapStateToProps(state) {
  return {
    activeBasemap: getBasemap(state.location),
    activeLabels: getLabels(state.location),
    mapZoom: getMapZoom(state.location)
  };
}

class BasemapsContainer extends React.Component {
  static propTypes = {
    setMapSettings: PropTypes.func.isRequired,
    setLandsatBasemap: PropTypes.func.isRequired
  };

  selectBasemap = (basemap, year) => {
    if (basemap.dynamic) {
      if (basemap.id === 'landsat') {
        return this.props.setLandsatBasemap(year, basemap.defaultUrl);
      }
    }
    return this.props.setMapSettings({ basemap });
  };

  selectLabels = label => this.props.setMapSettings({ label });

  render() {
    return (
      <BasemapsComponent
        {...this.props}
        selectBasemap={this.selectBasemap}
        selectLabels={this.selectLabels}
      />
    );
  }
}

const ConnectedBasemaps = connect(mapStateToProps, {
  setMapSettings,
  setLandsatBasemap
})(BasemapsContainer);

export default React.forwardRef((props, ref) => (
  <ConnectedBasemaps {...props} fowardedRef={ref} />
));
