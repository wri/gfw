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
    const { location: { type, adm0, adm1, adm2 }, getGeostore } = this.props;

    if (adm0) {
      getGeostore({ type, adm0, adm1, adm2 });
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { adm0, adm1, adm2, type } } = this.props;
    const { getGeostore, setGeostore } = prevProps;
    const hasAdm0Changed = adm0 && adm0 !== prevProps.location.adm0;
    const hasAdm1Changed = adm0 && adm1 !== prevProps.location.adm1;
    const hasAdm2Changed = adm0 && adm1 && adm2 !== prevProps.location.adm2;

    if (!adm0 && adm0 !== prevProps.location.adm0) {
      setGeostore({});
    }

    if (hasAdm0Changed) {
      getGeostore({ type, adm0, adm1, adm2 });
    }

    if (hasAdm1Changed) {
      getGeostore({ type, adm0, adm1, adm2 });
    }

    if (hasAdm2Changed) {
      getGeostore({ type, adm0, adm1, adm2 });
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
