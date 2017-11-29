import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { COUNTRY } from 'pages/country/router';
import HeaderComponent from './header-component';

const mapStateToProps = state => {
  const {
    isCountriesLoading,
    isRegionsLoading,
    isSubRegionsLoading,
    isGeostoreLoading
  } = state.countryData;
  return {
    isLoading:
      isCountriesLoading ||
      isRegionsLoading ||
      isSubRegionsLoading ||
      isGeostoreLoading
    // totalCoverHeader: state.header.totalCoverHeader,
    // totalForestHeader: state.header.totalForestHeader,
    // percentageForestHeader: state.header.percentageForestHeader,
    // totalCoverLoss: state.header.totalCoverLoss
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
