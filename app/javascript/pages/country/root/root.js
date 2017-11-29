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
  } = state.countryData;
  const adminData = {
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
    adminsSelected: getAdminsSelected({
      adminData,
      location: state.location.payload
    }),
    adminsLists: adminData
  };
};

class RootContainer extends PureComponent {
  handleShowMapMobile() {
    this.props.setShowMapMobile(!this.props.showMapMobile);
  }

  handleScrollCallback(props) {
    const { gfwHeaderHeight, isMapFixed, setFixedMapStatus, setMapTop } = props;

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
  setShowMapMobile: PropTypes.func,
  showMapMobile: PropTypes.bool
};

export default connect(mapStateToProps, { actions })(RootContainer);
