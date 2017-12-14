import { connect } from 'react-redux';
import {
  getAdminsSelected,
  getActiveAdmin
} from 'pages/country/widget/widget-selectors';
import Component from './widget-component';

const mapStateToProps = ({ location, countryData }) => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isGeostoreLoading
  } = countryData;
  const adminData = {
    location: location.payload,
    countries: countryData.countries,
    regions: countryData.regions,
    subRegions: countryData.subRegions
  };
  return {
    isMetaLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading,
    locationNames: getAdminsSelected(adminData),
    activeLocation: getActiveAdmin({ location: location.payload })
  };
};

export default connect(mapStateToProps, null)(Component);
