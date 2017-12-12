import { bindActionCreators } from 'redux';
import React, { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import {
  getAdminsOptions,
  getActiveAdmin,
  getAdminsSelected
} from 'pages/country/widget/widget-selectors';
import { format } from 'd3-format';

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
    locationOptions: getAdminsOptions({
      ...adminData,
      location: location.payload
    }),
    location: location.payload,
    locationNames: getAdminsSelected({
      ...adminData,
      location: location.payload
    }),
    activeLocation: getActiveAdmin({ location: location.payload }),
    treeCover: format('.2s')(header.treeCoverExtent),
    parcentageCover:
      percentageCover > 1 ? format('.2s')(percentageCover) : null
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
    const { location, settings, getTotalExtent, getTotalLoss } = this.props;
    getTotalExtent({ ...location, ...settings });
    getTotalLoss({ ...location, ...settings });
    // getTreeCoverExtent({ ...location });
    // if (location.region) {
    //   getTotalArea({ ...location });
    // }
    // if (location.subRegion) {
    //   getTotalArea({ ...location });
    // }
  }

  // componentWillReceiveProps(nextProps) {
  //   const { country, region, subRegion } = nextProps.location;
  //   const { getTotalArea, getTreeCoverExtent } = this.props;
  //   const hasCountryChanged = country !== this.props.location.country;
  //   const hasRegionChanged = region !== this.props.location.region;
  //   const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

  //   if (hasCountryChanged) {
  //     getTotalArea({ ...nextProps.location });
  //     getTreeCoverExtent({ ...nextProps.location });
  //   }
  //   if (region && hasRegionChanged) {
  //     getTotalArea({ ...nextProps.location });
  //     getTreeCoverExtent({ ...nextProps.location });
  //   }
  //   if (subRegion && hasSubRegionChanged) {
  //     getTotalArea({ ...nextProps.location });
  //     getTreeCoverExtent({ ...nextProps.location });
  //   }
  // }

  getHeaderDescription = () => {
    const {
      treeCover,
      parcentageCover,
      locationNames,
      activeLocation
    } = this.props;
    const currentLocation = locationNames.current && locationNames.current[activeLocation];
    return (
      <div>
        <p>
          In 2010,{' '}
          {currentLocation && currentLocation.label} had{' '}
          <b>{treeCover}ha</b> of tree cover
          {parcentageCover > 0 && ', extending over '}
          {parcentageCover > 0 && <b>{parcentageCover}%</b>}
          {parcentageCover > 0 && ' of its land area'}.
          In <b>2016</b>, it lost <b>{format('.2s')(1566959)}ha</b> of forest
          excluding tree plantations, equivalent to{' '}
          <b>{format('.2s')(350328700)}</b> tonnes of CO₂ of emissions.
        </p>
      </div>
    );
  };

  render() {
    return createElement(HeaderComponent, {
      ...this.props,
      getHeaderDescription: this.getHeaderDescription
    });
  }
}

HeaderContainer.propTypes = {
  location: PropTypes.object.isRequired,
  locationNames: PropTypes.object.isRequired,
  getTotalExtent: PropTypes.func.isRequired,
  getTotalLoss: PropTypes.func.isRequired,
  treeCover: PropTypes.string.isRequired,
  parcentageCover: PropTypes.string,
  activeLocation: PropTypes.string.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
