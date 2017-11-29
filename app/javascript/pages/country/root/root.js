import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAdminsSelected } from './root-selectors';

import RootComponent from './root-component';
import actions from './root-actions';

export { initialState } from './root-reducers';
export { default as reducers } from './root-reducers';
export { default as actions } from './root-actions';

const mapStateToProps = state => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isGeostoreLoading
  } = state.root;
  const adminData = {
    countries: state.root.countries,
    regions: state.root.regions,
    subRegions: state.root.subRegions
  };
  return {
    isRootLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading,
    location: state.location.payload,
    gfwHeaderHeight: state.root.gfwHeaderHeight,
    isMapFixed: state.root.isMapFixed,
    mapTop: state.root.mapTop,
    topPage: state.root.topPage,
    showMapMobile: state.root.showMapMobile,
    adminsSelected: getAdminsSelected({
      adminData,
      location: state.location.payload
    }),
    adminsLists: adminData
  };
};

class RootContainer extends PureComponent {
  componentWillMount() {
    const {
      location,
      getCountries,
      getRegions,
      getSubRegions,
      getGeostore
    } = this.props;
    getCountries();
    getRegions(location.country);
    if (location.region) {
      getSubRegions(location.country, location.region);
    }
    getGeostore(location.country, location.region, location.subRegion);
  }

  componentWillReceiveProps(nextProps) {
    const { getRegions, getSubRegions, getGeostore } = this.props;
    const hasCountryChanged =
      nextProps.location.country !== this.props.location.country;
    const hasRegionChanged =
      nextProps.location.region !== this.props.location.region;
    const hasSubRegionChanged =
      nextProps.location.subRegion !== this.props.location.subRegion;

    if (hasCountryChanged) {
      getRegions(nextProps.location.country);
      if (nextProps.location.region) {
        getSubRegions(nextProps.location.country, nextProps.location.region);
      }
      getGeostore(
        nextProps.location.country,
        nextProps.location.region,
        nextProps.location.subRegion
      );
    }

    if (hasRegionChanged) {
      if (nextProps.location.region) {
        getSubRegions(nextProps.location.country, nextProps.location.region);
      }
      getGeostore(
        nextProps.location.country,
        nextProps.location.region,
        nextProps.location.subRegion
      );
    }

    if (hasSubRegionChanged) {
      getGeostore(
        nextProps.location.country,
        nextProps.location.region,
        nextProps.location.subRegion
      );
    }
  }

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
      handleShowMapMobile: this.handleShowMapMobile,
      handleScrollCallback: this.handleScrollCallback
    });
  }
}

RootContainer.propTypes = {
  getCountries: PropTypes.func,
  getRegions: PropTypes.func,
  getSubRegions: PropTypes.func,
  getGeostore: PropTypes.func,
  location: PropTypes.object,
  setShowMapMobile: PropTypes.func,
  showMapMobile: PropTypes.bool,
  gfwHeaderHeight: PropTypes.number,
  isMapFixed: PropTypes.bool,
  setFixedMapStatus: PropTypes.func,
  setMapTop: PropTypes.func
};

export default connect(mapStateToProps, actions)(RootContainer);
