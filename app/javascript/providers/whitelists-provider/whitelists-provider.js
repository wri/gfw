import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './whitelists-provider-actions';
import reducers, { initialState } from './whitelists-provider-reducers';

const mapStateToProps = state => ({
  location: state.location.payload
});

class WhitelistProvider extends PureComponent {
  componentWillMount() {
    const { location, getCountryWhitelist, getRegionWhitelist } = this.props;
    getCountryWhitelist(location.country);
    if (location.region) {
      getRegionWhitelist(location.country, location.region, location.subRegion);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { country, region, subRegion } = nextProps.location;
    const { getCountryWhitelist, getRegionWhitelist } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (hasCountryChanged) {
      getCountryWhitelist(country);
    }

    if (hasRegionChanged || hasSubRegionChanged) {
      getRegionWhitelist(country, region, subRegion);
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

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(WhitelistProvider);
