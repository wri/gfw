import { connect } from 'react-redux';
import Component from './widgets-component';

import { getAdminsSelected } from './widgets-selectors';

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
    isMetaLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading,
    locationNames: getAdminsSelected({
      adminData,
      location: state.location.payload
    })
  };
};

export default connect(mapStateToProps, null)(Component);
