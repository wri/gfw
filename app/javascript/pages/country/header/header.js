import { bindActionCreators } from 'redux';
import React, { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import isEqual from 'lodash/isEqual';

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
    isSubRegionsLoading
  } = countryData;
  const {
    isExtentLoading,
    isPlantationsLossLoading,
    isTotalLossLoading
  } = header;
  const countryDataLoading =
    isCountriesLoading || isRegionsLoading || isSubRegionsLoading;
  const headerDataLoading =
    isExtentLoading || isPlantationsLossLoading || isTotalLossLoading;
  const adminData = {
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions
  };
  return {
    isLoading: countryDataLoading || headerDataLoading,
    locationOptions: getAdminsOptions({
      ...adminData,
      location: location.payload
    }),
    settings: header.settings,
    location: location.payload,
    locationNames: getAdminsSelected({
      ...adminData,
      location: location.payload
    }),
    activeLocation: getActiveAdmin({ location: location.payload }),
    data: header.data
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
    const {
      location,
      settings,
      getTotalExtent,
      getTotalLoss,
      getPlantationsLoss
    } = this.props;
    getTotalExtent({ ...location, ...settings });
    getTotalLoss({ ...location, ...settings });
    getPlantationsLoss({ ...location, ...settings, indicator: 'plantations' });
    if (location.region) {
      getTotalExtent({ ...location, ...settings });
    }
    if (location.subRegion) {
      getTotalExtent({ ...location, ...settings });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, settings } = nextProps;
    const { getTotalExtent, getTotalLoss, getPlantationsLoss } = this.props;

    if (!isEqual(location, this.props.location)) {
      getTotalExtent({ ...nextProps.location, ...settings });
      getTotalLoss({ ...nextProps.location, ...settings });
      getPlantationsLoss({
        ...nextProps.location,
        ...settings,
        indicator: 'plantations'
      });
    }
  }

  getHeaderDescription = () => {
    const { locationNames, activeLocation, data } = this.props;
    const percentageCover = format('.1f')(data.extent / data.totalArea * 100);
    const currentLocation =
      locationNames.current && locationNames.current[activeLocation];
    const lossWithOutPlantations =
      data.totalLoss.area - (data.plantationsLoss.area || 0);
    const emissionsWithoutPlantations =
      data.totalLoss.emissions - (data.plantationsLoss.emissions || 0);
    return (
      <div>
        <p>
          In 2010, {currentLocation && currentLocation.label} had{' '}
          <b>{format('.2s')(data.extent)}ha</b> of tree cover
          {percentageCover > 0 && ', extending over '}
          {percentageCover > 0 && <b>{percentageCover}%</b>}
          {percentageCover > 0 && ' of its land area'}. In{' '}
          <b>{data.totalLoss.year}</b>, it lost{' '}
          <b>{format('.2s')(lossWithOutPlantations)}ha</b> of forest excluding
          tree plantations, equivalent to{' '}
          <b>{format('.2s')(emissionsWithoutPlantations)}</b> tonnes of CO₂ of
          emissions.
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
  getPlantationsLoss: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  activeLocation: PropTypes.string.isRequired,
  settings: PropTypes.object.isRequired
};

export { actions, reducers, initialState };

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
