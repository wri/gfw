import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './gadm-area-provider-actions';
import reducers, { initialState } from './gadm-area-provider-reducers';

const mapStateToProps = state => ({
  location: state.location.payload
});

class GadmAreaProvider extends PureComponent {
  componentDidMount() {
    const { location, getGadmArea } = this.props;
    getGadmArea(location.country);
    if (location.region) {
      getGadmArea(location.country, location.region);
    }
    if (location.subRegion) {
      getGadmArea(location.country, location.region, location.subRegion);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { country, region, subRegion } = nextProps.location;
    const { getGadmArea } = this.props;
    const hasCountryChanged = country !== this.props.location.country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (hasCountryChanged) {
      getGadmArea(country);
    }
    if (region && hasRegionChanged) {
      getGadmArea(country, region);
    }
    if (subRegion && hasSubRegionChanged) {
      getGadmArea(country, region, subRegion);
    }
  }

  render() {
    return null;
  }
}

GadmAreaProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getGadmArea: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(GadmAreaProvider);
