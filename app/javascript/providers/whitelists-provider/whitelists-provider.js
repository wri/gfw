import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './whitelists-provider-actions';
import reducers, { initialState } from './whitelists-provider-reducers';

const mapStateToProps = ({ location }) => ({
  location: location.payload
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

  componentWillReceiveProps(nextProps) {
    const { location: { adm0, adm1, adm2 } } = nextProps;
    const { getCountryWhitelist, getRegionWhitelist } = this.props;
    const hasCountryChanged = adm0 && adm0 !== this.props.location.adm0;
    const hasRegionChanged = adm0 && adm1 !== this.props.location.adm1;
    const hasSubRegionChanged =
      adm0 && adm1 && adm2 !== this.props.location.adm2;

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

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(WhitelistProvider);
