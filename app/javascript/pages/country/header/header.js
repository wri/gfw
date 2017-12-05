import { bindActionCreators } from 'redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import {
  getAdminsOptions,
  getAdminsSelected,
  getActiveAdmin
} from 'pages/country/utils/filters';
import { format } from 'd3-format';

import * as actions from './header-actions';
import reducers, { initialState } from './header-reducers';

import HeaderComponent from './header-component';

const mapStateToProps = state => {
  const location = state.location.payload;
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isGeostoreLoading
  } = state.countryData;
  const adminData = {
    location,
    countries: state.countryData.countries,
    regions: state.countryData.regions,
    subRegions: state.countryData.subRegions
  };
  const totalArea = state.header[`${getActiveAdmin(location)}Area`];
  const percentageCover = state.header.treeCoverExtent / totalArea * 100;
  return {
    isLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading,
    adminsSelected: getAdminsSelected(adminData),
    adminsOptions: getAdminsOptions(adminData),
    location,
    activeAdmin: getActiveAdmin(location),
    treeCover: format('.2s')(state.header.treeCoverExtent),
    parcentageCover: percentageCover > 1 ? format('.0f')(percentageCover) : 0
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
    const { getArea, getTreeCoverExtent } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

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

HeaderContainer.propTypes = {
  location: PropTypes.object.isRequired,
  getArea: PropTypes.func.isRequired,
  getTreeCoverExtent: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
