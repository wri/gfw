import { connect } from 'react-redux';
import { getAdminsSelected } from 'pages/country/widgets/widgets-selectors';
import Component from './widgets-component';

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
    isMetaLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading,
    locationNames: getAdminsSelected(adminData)
  };
};

export default connect(mapStateToProps, null)(Component);
