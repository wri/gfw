import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './country-data-provider-actions';
import reducers, { initialState } from './country-data-provider-reducers';

const mapStateToProps = state => ({
  location: state.location.payload
});

class CountryDataProvider extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const {
      isParentLoading,
      location: { country, region, subRegion }
    } = nextProps;
    const {
      getCountries,
      getRegions,
      getSubRegions,
      getGeostore,
      getCountryLinks
    } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (isParentLoading !== this.props.isParentLoading) {
      getCountries();
      getRegions(country);
      if (region) {
        getSubRegions(country, region);
      }
      getGeostore(country, region, subRegion);
      getCountryLinks();
    }

    if (hasCountryChanged) {
      getRegions(country);
      if (region) {
        getSubRegions(country, region);
      }
      getGeostore(country, region, subRegion);
    }

    if (hasRegionChanged) {
      if (region) {
        getSubRegions(country, region);
      }
      getGeostore(country, region);
    }

    if (hasSubRegionChanged) {
      getGeostore(country, region, subRegion);
    }
  }

  render() {
    return null;
  }
}

CountryDataProvider.propTypes = {
  location: PropTypes.object.isRequired,
  isParentLoading: PropTypes.bool.isRequired,
  getCountries: PropTypes.func.isRequired,
  getRegions: PropTypes.func.isRequired,
  getSubRegions: PropTypes.func.isRequired,
  getGeostore: PropTypes.func.isRequired,
  getCountryLinks: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(CountryDataProvider);
