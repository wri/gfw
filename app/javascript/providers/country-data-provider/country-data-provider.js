import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './country-data-provider-actions';
import reducers, { initialState } from './country-data-provider-reducers';

const mapStateToProps = state => ({
  location: state.location.payload
});

class CountryDataProvider extends PureComponent {
  componentWillMount() {
    const {
      location,
      getCountries,
      getRegions,
      getSubRegions,
      getGeostore,
      getCountryLinks
    } = this.props;
    getCountries();
    if (location.country) {
      getRegions(location.country);
      getGeostore(location.country, location.region, location.subRegion);
    }
    if (location.region) {
      getSubRegions(location.country, location.region);
    }
    getCountryLinks();
  }

  componentWillReceiveProps(nextProps) {
    const { country, region, subRegion } = nextProps.location;
    const { getRegions, getSubRegions, getGeostore, setGeostore } = this.props;
    const hasCountryChanged =
      country !== this.props.location.country && country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (!country) {
      setGeostore({});
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
  getCountries: PropTypes.func.isRequired,
  getRegions: PropTypes.func.isRequired,
  getSubRegions: PropTypes.func.isRequired,
  getGeostore: PropTypes.func.isRequired,
  getCountryLinks: PropTypes.func.isRequired,
  setGeostore: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(CountryDataProvider);
