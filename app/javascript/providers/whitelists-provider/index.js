import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';
import { CancelToken } from 'axios';

import { getDataLocation } from 'utils/location';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = state => ({
  location: getDataLocation(state)
});

class WhitelistProvider extends PureComponent {
  componentDidMount() {
    const { location: { adm0, adm1, adm2 } } = this.props;
    if (adm0) {
      this.handleFetchWhitelist({ adm0, adm1, adm2 });
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { type, adm0, adm1, adm2 } = location;
    const isCountry = type === 'country';

    if (isCountry) {
      const hasLocationChanged = adm0 && !isEqual(location, prevProps.location);

      if (hasLocationChanged) {
        this.handleFetchWhitelist({ adm0, adm1, adm2 });
      }
    }
  }

  handleFetchWhitelist = params => {
    const { getWhitelist } = this.props;

    this.cancelWhitelistFetch();
    this.whitelistFetch = CancelToken.source();
    getWhitelist({ ...params, token: this.whitelistFetch.token });
  };

  cancelWhitelistFetch = () => {
    if (this.whitelistFetch) {
      this.whitelistFetch.cancel('Cancelling whitelist fetch');
    }
  };

  render() {
    return null;
  }
}

WhitelistProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getWhitelist: PropTypes.func.isRequired
};

reducerRegistry.registerModule('whitelists', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(WhitelistProvider);
