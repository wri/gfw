import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import * as actions from './whitelists-provider-actions';
import reducers, { initialState } from './whitelists-provider-reducers';

const mapStateToProps = ({ location }) => ({
  location: location && location.payload
});

class WhitelistProvider extends PureComponent {
  componentDidMount() {
    const {
      location: { adm0, adm1, adm2 },
      getCountryWhitelist,
      getRegionWhitelist
    } = this.props;
    getCountryWhitelist(adm0);
    if (adm1) {
      getRegionWhitelist({ adm0, adm1, adm2 });
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { adm0, adm1, adm2 } } = this.props;
    const { getCountryWhitelist, getRegionWhitelist } = prevProps;
    const hasCountryChanged = adm0 && adm0 !== prevProps.location.adm0;
    const hasRegionChanged = adm0 && adm1 !== prevProps.location.adm1;
    const hasSubRegionChanged =
      adm0 && adm1 && adm2 !== prevProps.location.adm2;

    if (hasCountryChanged) {
      getCountryWhitelist(adm0);
    }

    if (hasRegionChanged || hasSubRegionChanged) {
      getRegionWhitelist({ adm0, adm1, adm2 });
    }
  }

  render() {
    return null;
  }
}

WhitelistProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getCountryWhitelist: PropTypes.func.isRequired,
  getRegionWhitelist: PropTypes.func.isRequired
};

reducerRegistry.registerModule('whitelists', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(WhitelistProvider);
