import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './whitelists-provider-actions';
import reducers, { initialState } from './whitelists-provider-reducers';

const mapStateToProps = state => ({
  location: state.location.payload
});

class CountryDataProvider extends PureComponent {
  componentWillMount() {
    const {
      location,
      getCountryWhitelist,
      getRegionWhitelist,
      getWaterBodiesWhitelist
    } = this.props;
    getCountryWhitelist(location.country);
    if (location.region) {
      getRegionWhitelist(location.country, location.region, location.subRegion);
    }
    getWaterBodiesWhitelist();
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

CountryDataProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getCountryWhitelist: PropTypes.func.isRequired,
  getRegionWhitelist: PropTypes.func.isRequired,
  getWaterBodiesWhitelist: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(CountryDataProvider);
