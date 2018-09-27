import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location.payload
});

class CountryDataProvider extends PureComponent {
  componentDidMount() {
    const {
      location: { country, region },
      getCountries,
      getRegions,
      getSubRegions,
      getCountryLinks
    } = this.props;
    getCountries();

    if (country) {
      getCountryLinks();
      getRegions(country);
    }
    if (region) {
      getSubRegions({ country, region });
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { country, region } } = this.props;
    const { getRegions, getSubRegions, getCountryLinks } = prevProps;
    const hasCountryChanged = country !== prevProps.location.country && country;
    const hasRegionChanged = region !== prevProps.location.region;

    if (hasCountryChanged) {
      getCountryLinks();
      getRegions(country);
      if (region) {
        getSubRegions({ country, region });
      }
    }

    if (hasRegionChanged) {
      if (region) {
        getSubRegions({ country, region });
      }
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
  getCountryLinks: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(CountryDataProvider);
