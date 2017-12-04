import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import {
  getAdminsOptions,
  getAdminsSelected
} from 'pages/country/utils/filters';

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
    adminsOptions: getAdminsOptions(adminData)
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
      })
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
