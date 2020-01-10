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
  static propTypes = {
    location: PropTypes.object.isRequired,
    getWhitelist: PropTypes.func.isRequired,
    setWhitelist: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { location: { type, adm0, adm1, adm2 } } = this.props;
    if (adm0) {
      this.handleFetchWhitelist({ type, adm0, adm1, adm2 });
    }
  }

  componentDidUpdate(prevProps) {
    const { location, setWhitelist } = this.props;
    const { type, adm0, adm1, adm2 } = location;
    const hasLocationChanged = !isEqual(location, prevProps.location);

    if (adm0 && hasLocationChanged) {
      this.handleFetchWhitelist({ type, adm0, adm1, adm2 });
    }

    if (type === 'global' && hasLocationChanged) {
      setWhitelist({});
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

reducerRegistry.registerModule('whitelists', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(WhitelistProvider);
