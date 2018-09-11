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
      location: { country, region, subRegion },
      getCountryWhitelist,
      getRegionWhitelist
    } = this.props;
    getCountryWhitelist(country);
    if (region) {
      getRegionWhitelist({ country, region, subRegion });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location: { country, region, subRegion } } = nextProps;
    const { getCountryWhitelist, getRegionWhitelist } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (hasCountryChanged) {
      getCountryWhitelist(country);
    }

    if (hasRegionChanged || hasSubRegionChanged) {
      getRegionWhitelist({ country, region, subRegion });
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
