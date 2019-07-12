import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';

import * as actions from './whitelists-provider-actions';
import reducers, { initialState } from './whitelists-provider-reducers';

const mapStateToProps = ({ location }) => ({
  location: location && location.payload
});

class WhitelistProvider extends PureComponent {
  componentDidMount() {
    const { location: { adm0, adm1, adm2 }, getWhitelist } = this.props;
    if (adm0) {
      getWhitelist({ adm0, adm1, adm2 });
    }
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    const { type, adm0, adm1, adm2 } = location;
    const isCountry = type === 'country';

    if (isCountry) {
      const { getWhitelist } = prevProps;
      const hasLocationChanged = adm0 && !isEqual(location, prevProps.location);

      if (hasLocationChanged) {
        getWhitelist({ adm0, adm1, adm2 });
      }
    }
  }

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
