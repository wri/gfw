import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getAdminsOptions,
  getAdminsSelected
} from 'pages/country/utils/filters';

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
  } = state.countryData;
  const adminData = {
    location: state.location.payload,
    countries: state.countryData.countries,
    regions: state.countryData.regions,
    subRegions: state.countryData.subRegions
  };
  return {
    isLoading:
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
    adminsSelected: getAdminsSelected(adminData),
    adminsOptions: getAdminsOptions(adminData)
  };
};

class RootContainer extends PureComponent {
  constructor() {
    super();
    this.state = {
      mapFixedLimit: 0,
      isMapFixed: true,
      mapTop: 0
    };
  }

  handleShowMapMobile = () => {
    this.props.setShowMapMobile(!this.props.showMapMobile);
  };

  handleScrollCallback = () => {
    const { isMapFixed, mapFixedLimit } = this.state;
    const { gfwHeaderHeight } = this.props;

    if (!mapFixedLimit) {
      this.setState({
        mapFixedLimit:
          document.getElementById('c-stories').offsetTop - window.innerHeight
      });
    }

    if (
      !isMapFixed &&
      window.scrollY < mapFixedLimit &&
      window.pageYOffset >= gfwHeaderHeight
    ) {
      this.setState({ isMapFixed: true, mapTop: 0 });
    }

    if (isMapFixed && window.scrollY >= mapFixedLimit) {
      this.setState({
        isMapFixed: false,
        mapTop: mapFixedLimit - gfwHeaderHeight
      });
    }

    if (isMapFixed && window.scrollY < gfwHeaderHeight) {
      this.setState({ isMapFixed: false, mapTop: 0 });
    }
  };

  render() {
    const { isMapFixed, mapTop } = this.state;
    return createElement(RootComponent, {
      ...this.props,
      isMapFixed,
      mapTop,
      handleShowMapMobile: this.handleShowMapMobile,
      handleScrollCallback: this.handleScrollCallback
    });
  }
}

RootContainer.propTypes = {
  setShowMapMobile: PropTypes.func,
  showMapMobile: PropTypes.bool,
  gfwHeaderHeight: PropTypes.number
};

export default connect(mapStateToProps, actions)(RootContainer);
