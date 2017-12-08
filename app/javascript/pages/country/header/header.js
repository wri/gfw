import { bindActionCreators } from 'redux';
import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import {
  getAdminsOptions,
  getAdminsSelected,
  getActiveAdmin
} from 'pages/country/widget/widget-selectors';
import numeral from 'numeral';

import * as actions from './header-actions';
import reducers, { initialState } from './header-reducers';

import HeaderComponent from './header-component';

const mapStateToProps = ({ countryData, location, header }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isGeostoreLoading
  } = countryData;
  const adminData = {
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions
  };
  const totalArea = header[`${getActiveAdmin(location)}Area`];
  const percentageCover = header.treeCoverExtent / totalArea * 100;
  return {
    isLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading,
    adminsSelected: getAdminsSelected({
      ...adminData,
      location: location.payload
    }),
    adminsOptions: getAdminsOptions({
      ...adminData,
      location: location.payload
    }),
    location: location.payload,
    activeAdmin: getActiveAdmin(location),
    treeCover: numeral(header.treeCoverExtent).format('0 a'),
    parcentageCover:
      percentageCover > 1 ? numeral(percentageCover).format('0,0') : null
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
    const { location, getTotalArea, getTreeCoverExtent } = this.props;
    getTotalArea({ ...location });
    getTreeCoverExtent({ ...location });
    if (location.region) {
      getTotalArea({ ...location });
    }
    if (location.subRegion) {
      getTotalArea({ ...location });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { country, region, subRegion } = nextProps.location;
    const { getTotalArea, getTreeCoverExtent } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (hasCountryChanged) {
      getTotalArea({ ...nextProps.location });
      getTreeCoverExtent({ ...nextProps.location });
    }
    if (region && hasRegionChanged) {
      getTotalArea({ ...nextProps.location });
      getTreeCoverExtent({ ...nextProps.location });
    }
    if (subRegion && hasSubRegionChanged) {
      getTotalArea({ ...nextProps.location });
      getTreeCoverExtent({ ...nextProps.location });
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
  getTotalArea: PropTypes.func.isRequired,
  getTreeCoverExtent: PropTypes.func.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
