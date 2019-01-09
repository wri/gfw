import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location && location.payload
});

class CountryDataProvider extends PureComponent {
  componentDidMount() {
    const {
      location: { adm0, adm1 },
      getCountries,
      getRegions,
      getSubRegions,
      getCountryLinks
    } = this.props;
    getCountries();

    if (adm0) {
      getCountryLinks();
      getRegions(adm0);
    }
    if (adm1) {
      getSubRegions({ adm0, adm1 });
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { adm0, adm1 } } = this.props;
    const { getRegions, getSubRegions, getCountryLinks } = prevProps;
    const hasCountryChanged = adm0 && adm0 !== prevProps.location.adm0;
    const hasRegionChanged = adm0 && adm1 && adm1 !== prevProps.location.adm1;

    if (hasCountryChanged) {
      getCountryLinks();
      getRegions(adm0);
      if (adm1) {
        getSubRegions({ adm0, adm1 });
      }
    }

    if (hasRegionChanged) {
      getSubRegions({ adm0, adm1 });
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

reducerRegistry.registerModule('countryData', {
  actions,
  reducers,
  initialState
});
export default connect(mapStateToProps, actions)(CountryDataProvider);
