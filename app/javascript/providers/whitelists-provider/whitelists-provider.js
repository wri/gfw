import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './whitelists-provider-actions';
import reducers, { initialState } from './whitelists-provider-reducers';

const mapStateToProps = state => ({
  location: state.location.payload
});

class WhitelistProvider extends PureComponent {
  componentWillReceiveProps(nextProps) {
    const {
      isParentLoading,
      location: { country, region, subRegion }
    } = nextProps;
    const { getCountryWhitelist, getRegionWhitelist } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (isParentLoading !== this.props.isParentLoading) {
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
  isParentLoading: PropTypes.bool.isRequired,
  getCountryWhitelist: PropTypes.func.isRequired,
  getRegionWhitelist: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(WhitelistProvider);
