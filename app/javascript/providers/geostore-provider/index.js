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
      location: { type, country, region, subRegion },
      getGeostore
    } = this.props;

    if (country) {
      getGeostore({ type, country, region, subRegion });
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { country, region, subRegion, type } } = this.props;
    const { getGeostore, setGeostore } = prevProps;
    const hasCountryChanged = country && country !== prevProps.location.country;
    const hasRegionChanged = country && region !== prevProps.location.region;
    const hasSubRegionChanged =
      country && region && subRegion !== prevProps.location.subRegion;

    if (!country && country !== prevProps.location.country) {
      setGeostore({});
    }

    if (hasCountryChanged) {
      getGeostore({ type, country, region, subRegion });
    }

    if (hasRegionChanged) {
      getGeostore({ type, country, region, subRegion });
    }

    if (hasSubRegionChanged) {
      getGeostore({ type, country, region, subRegion });
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

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(GeostoreProvider);
