import { bindActionCreators } from 'redux';
import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import {
  getAdminsOptions,
  getAdminsSelected
} from 'pages/country/utils/filters';

import * as actions from './header-actions';
import reducers, { initialState } from './header-reducers';

import HeaderComponent from './header-component';

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
    adminsSelected: getAdminsSelected(adminData),
    adminsOptions: getAdminsOptions(adminData),
    location: adminData.location,
    totalArea: state.Areas.countryArea
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleCountryChange: country => ({
        type: COUNTRY,
        payload: { country: country.value }
      }),
      handleRegionChange: (country, region) => ({
        type: COUNTRY,
        payload: { country: country.value, region: region.value }
      }),
      handleSubRegionChange: (country, region, subRegion) => ({
        type: COUNTRY,
        payload: {
          country: country.value,
          region: region.value,
          subRegion: subRegion.value
        }
      }),
      ...actions
    },
    dispatch
  );

class HeaderContainer extends PureComponent {
  componentDidMount() {
    const { location, getArea, getTreeCoverExtent } = this.props;
    getArea(location.country);
    getTreeCoverExtent(location.country, location.region, location.subRegion);
    if (location.region) {
      getArea(location.country, location.region);
    }
    if (location.subRegion) {
      getArea(location.country, location.region, location.subRegion);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { country, region, subRegion } = nextProps.location;
    const { prevLocation } = this.props;
    const { getArea, getTreeCoverExtent } = this.props;
    const hasCountryChanged = country !== prevLocation.country;
    const hasRegionChanged = region !== prevLocation.region;
    const hasSubRegionChanged = subRegion !== prevLocation.subRegion;

    if (hasCountryChanged) {
      getArea(country);
      getTreeCoverExtent(country);
    }
    if (region && hasRegionChanged) {
      getArea(country, region);
      getTreeCoverExtent(country, region);
    }
    if (subRegion && hasSubRegionChanged) {
      getArea(country, region, subRegion);
      getTreeCoverExtent(country, region, subRegion);
    }
  }

  render() {
    return createElement(HeaderComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
