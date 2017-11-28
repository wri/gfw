import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getCountriesProvider,
  getRegionsProvider,
  getSubRegionsProvider
} from 'services/country';
import { getGeostoreProvider } from 'services/geostore';

import RootComponent from './root-component';
import actions from './root-actions';

export { initialState } from './root-reducers';
export { default as reducers } from './root-reducers';
export { default as actions } from './root-actions';

const mapStateToProps = state => ({
  location: state.location.payload,
  gfwHeaderHeight: state.root.gfwHeaderHeight,
  isMapFixed: state.root.isMapFixed,
  mapTop: state.root.mapTop,
  topPage: state.root.topPage,
  showMapMobile: state.root.showMapMobile
});

class RootContainer extends PureComponent {
  componentWillMount() {
    const { location } = this.props;

    this.getCountries();
    this.getRegions(location.country);
    if (location.region) {
      this.getSubRegions(location.country, location.region);
    }
    this.getGeoStore(location.country, location.region, location.subRegion);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.country !== this.props.location.country) {
      this.getRegions(location.country);
      if (location.region) {
        this.getSubRegions(location.country, location.region);
      }
      this.getGeoStore(location.country, location.region, location.subRegion);
    }

    if (nextProps.location.region !== this.props.location.region) {
      this.getSubRegions(location.country, location.region);
      this.getGeoStore(location.country, location.region, location.subRegion);
    }

    if (nextProps.location.subRegion !== this.props.location.subRegion) {
      this.getGeoStore(location.country, location.region, location.subRegion);
    }
  }

  // fetches for locaton meta data
  getCountries = () => {
    const { setCountries } = this.props;
    getCountriesProvider().then(response => {
      setCountries(response.data.rows);
    });
  };

  getRegions = location => {
    const { setRegions } = this.props;
    getRegionsProvider(location).then(response => {
      setRegions(response.data.rows);
    });
  };

  getSubRegions = (country, region) => {
    const { setSubRegions } = this.props;
    getSubRegionsProvider(country, region).then(response => {
      setSubRegions(response.data.rows);
    });
  };

  getGeoStore = (country, region, subRegion) => {
    const { setGeostore } = this.props;
    getGeostoreProvider(country, region, subRegion).then(response => {
      const { areaHa, bbox } = response.data.data.attributes;
      setGeostore({
        areaHa,
        bounds: this.getBoxBounds(bbox)
      });
    });
  };

  getBoxBounds = cornerBounds => [
    [cornerBounds[0], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[3]],
    [cornerBounds[2], cornerBounds[1]],
    [cornerBounds[0], cornerBounds[1]]
  ];

  handleShowMapMobile() {
    this.props.setShowMapMobile(!this.props.showMapMobile);
  }

  handleScrollCallback() {
    const {
      gfwHeaderHeight,
      isMapFixed,
      setFixedMapStatus,
      setMapTop
    } = this.props;

    const mapFixedLimit =
      document.getElementById('c-widget-stories').offsetTop -
      window.innerHeight;

    if (
      !isMapFixed &&
      window.scrollY >= gfwHeaderHeight &&
      window.scrollY < mapFixedLimit
    ) {
      setFixedMapStatus(true);
      setMapTop(0);
    } else if (isMapFixed && window.scrollY >= mapFixedLimit) {
      setFixedMapStatus(false);
      setMapTop(mapFixedLimit);
    }
  }

  render() {
    return createElement(RootComponent, {
      ...this.props,
      checkLoadingStatus: this.checkLoadingStatus,
      handleShowMapMobile: this.handleShowMapMobile,
      handleScrollCallback: this.handleScrollCallback
    });
  }
}

RootContainer.propTypes = {
  location: PropTypes.object,
  setGeostore: PropTypes.func,
  setCountries: PropTypes.func,
  setRegions: PropTypes.func,
  setSubRegions: PropTypes.func,
  setShowMapMobile: PropTypes.func,
  showMapMobile: PropTypes.bool,
  gfwHeaderHeight: PropTypes.number,
  isMapFixed: PropTypes.bool,
  setFixedMapStatus: PropTypes.func,
  setMapTop: PropTypes.func
};

export default connect(mapStateToProps, actions)(RootContainer);
