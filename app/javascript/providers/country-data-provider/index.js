import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';
import { CancelToken } from 'axios';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location && location.payload
});

class CountryDataProvider extends PureComponent {
  componentDidMount() {
    const { location: { adm0, adm1 }, getCountries } = this.props;
    getCountries();

    if (adm0) {
      this.handleCountryLinksFetch();
      this.handleRegionFetch(adm0);
    }
    if (adm1) {
      this.handleSubRegionFetch({ adm0, adm1 });
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { adm0, adm1 } } = this.props;
    const hasCountryChanged = adm0 && adm0 !== prevProps.location.adm0;
    const hasRegionChanged = adm0 && adm1 && adm1 !== prevProps.location.adm1;

    if (hasCountryChanged) {
      this.handleCountryLinksFetch();
      this.handleRegionFetch(adm0);
      if (adm1) {
        this.handleSubRegionFetch({ adm0, adm1 });
      }
    }

    if (hasRegionChanged) {
      this.handleSubRegionFetch({ adm0, adm1 });
    }
  }

  handleRegionFetch = adm0 => {
    const { getRegions } = this.props;
    this.cancelRegionsFetch();
    this.regionsFetch = CancelToken.source();
    getRegions({ adm0, token: this.regionsFetch.token });
  };

  handleSubRegionFetch = params => {
    const { getSubRegions } = this.props;
    this.cancelSubRegionsFetch();
    this.subRegionsFetch = CancelToken.source();
    getSubRegions({ ...params, token: this.subRegionsFetch.token });
  };

  handleCountryLinksFetch = () => {
    const { getCountryLinks } = this.props;
    this.cancelCountryLinksFetch();
    this.countryLinksFetch = CancelToken.source();
    getCountryLinks(this.countryLinksFetch.token);
  };

  cancelRegionsFetch = () => {
    if (this.regionsFetch) {
      this.regionsFetch.cancel('Cancelling regions fetch');
    }
  };

  cancelSubRegionsFetch = () => {
    if (this.subRegionsFetch) {
      this.subRegionsFetch.cancel('Cancelling regions fetch');
    }
  };

  cancelCountryLinksFetch = () => {
    if (this.countryLinksFetch) {
      this.countryLinksFetch.cancel('Cancelling country links fetch');
    }
  };

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
