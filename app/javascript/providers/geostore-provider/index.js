import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location.payload
});

class GeostoreProvider extends PureComponent {
  componentDidMount() {
    const { location: { adm0 } } = this.props;

    if (adm0) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps) {
    const { location: { adm0, adm1, adm2 } } = this.props;
    const { setGeostore } = prevProps;
    const hasAdm0Changed = adm0 && adm0 !== prevProps.location.adm0;
    const hasAdm1Changed = adm0 && adm1 !== prevProps.location.adm1;
    const hasAdm2Changed = adm0 && adm1 && adm2 !== prevProps.location.adm2;

    if (!adm0 && adm0 !== prevProps.location.adm0) {
      setGeostore({});
      this.cancelGeostoreFetch();
    }

    if (hasAdm0Changed || hasAdm1Changed || hasAdm2Changed) {
      this.handleGetGeostore();
    }
  }

  handleGetGeostore = () => {
    this.cancelGeostoreFetch();
    this.geostoreFetch = CancelToken.source();
    this.props.getGeostore({
      ...this.props.location,
      token: this.geostoreFetch.token
    });
  };

  cancelGeostoreFetch = () => {
    if (this.geostoreFetch) {
      this.geostoreFetch.cancel();
    }
  };

  render() {
    return null;
  }
}

GeostoreProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getGeostore: PropTypes.func.isRequired,
  setGeostore: PropTypes.func.isRequired
};

reducerRegistry.registerModule('geostore', {
  actions,
  reducers,
  initialState
});
export default connect(mapStateToProps, actions)(GeostoreProvider);
