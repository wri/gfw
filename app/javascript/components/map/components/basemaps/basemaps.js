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
    mapZoom: PropTypes.number,
    activeBasemap: PropTypes.string,
    setMapSettings: PropTypes.func.isRequired,
    setLandsatBasemap: PropTypes.func.isRequired
  };

  componentDidUpdate(prevProps) {
    const { activeBasemap, mapZoom } = this.props;
    if (prevProps.mapZoom !== mapZoom && activeBasemap.id === 'landsat') {
      this.selectBasemap(activeBasemap, 2015);
    }
  }

  selectBasemap = (basemap, year = 2015) => {
    // for now, handling the dynamic url generation by id
    // if in the future we decide to have more basemaps with dynamic URLs
    // this should be replaced with a more general solution.
    if (basemap.id === 'landsat') {
      return this.props.setLandsatBasemap(year, basemap.defaultUrl);
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
