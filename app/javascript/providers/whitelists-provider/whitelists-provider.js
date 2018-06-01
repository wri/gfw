import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './whitelists-provider-actions';
import reducers, { initialState } from './whitelists-provider-reducers';

const mapStateToProps = ({ cache, location }) => ({
  location: location.payload,
  cacheLoading: cache.cacheListLoading
});

class WhitelistProvider extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const {
      cacheLoading,
      location: { country, region, subRegion }
    } = nextProps;
    const { getCountryWhitelist, getRegionWhitelist } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (cacheLoading !== this.props.cacheLoading) {
      getCountryWhitelist(country);
      if (region) {
        getRegionWhitelist(country, region, subRegion);
      }
    }

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
  cacheLoading: PropTypes.bool.isRequired,
  getCountryWhitelist: PropTypes.func.isRequired,
  getRegionWhitelist: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(WhitelistProvider);
