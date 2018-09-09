import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location.payload
});

class GeostoreProvider extends PureComponent {
  componentDidMount() {
    const {
      location: { country, region, subRegion },
      getGeostore
    } = this.props;

    if (country) {
      getGeostore(country, region, subRegion);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location: { country, region, subRegion } } = nextProps;
    const { getGeostore, setGeostore } = this.props;
    const hasCountryChanged =
      country !== this.props.location.country && country;
    const hasRegionChanged = region !== this.props.location.region;
    const hasSubRegionChanged = subRegion !== this.props.location.subRegion;

    if (!country && country !== this.props.location.country) {
      setGeostore({});
    }

    if (hasCountryChanged) {
      getGeostore(country, region, subRegion);
    }

    if (hasRegionChanged) {
      getGeostore(country, region, subRegion);
    }

    if (hasSubRegionChanged) {
      getGeostore(country, region, subRegion);
    }
  }

  render() {
    return null;
  }
}

GeostoreProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getGeostore: PropTypes.func.isRequired,
  setGeostore: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(GeostoreProvider);
