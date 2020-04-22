import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { cancelToken } from 'utils/request';
import reducerRegistry from 'app/registry';
import withRouter from 'utils/withRouter';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = (state) => {
  const { areas } = state;

  return {
    activeArea:
      areas &&
      areas.data &&
      areas.data.find(a => a.id === (location && location.adm0))
  };
};

class GeostoreProvider extends PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
    getGeostore: PropTypes.func.isRequired,
    clearGeostore: PropTypes.func.isRequired,
    activeArea: PropTypes.object
  }

  componentDidMount() {
    const { router, activeArea } = this.props;
    const { adm0, type } = router?.location || {};
    if ((adm0 && type !== 'aoi') || (type === 'aoi' && activeArea)) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      router,
      activeArea,
      clearGeostore
    } = this.props;
    const { adm0, adm1, adm2 } = router?.location || {};
    const hasAdm0Changed = adm0 && adm0 !== prevProps?.router?.location?.adm0;
    const hasAdm1Changed = adm0 && adm1 !== prevProps?.router?.location?.adm1;
    const hasAdm2Changed = adm0 && adm1 && adm2 !== prevProps?.router?.location?.adm2;
    const hasAoiChanged =
      activeArea && !isEqual(activeArea, prevProps.activeArea);

    if (!adm0 && adm0 !== prevProps?.router?.location?.adm0) {
      this.cancelGeostoreFetch();
      clearGeostore({});
    }

    if (hasAdm0Changed || hasAdm1Changed || hasAdm2Changed || hasAoiChanged) {
      this.handleGetGeostore();
    }
  }

  handleGetGeostore = () => {
    this.cancelGeostoreFetch();
    this.geostoreFetch = cancelToken();
    this.props.getGeostore({
      ...this.props?.router?.location,
      token: this.geostoreFetch.token
    });
  };

  cancelGeostoreFetch = () => {
    if (this.geostoreFetch) {
      this.geostoreFetch.cancel('Cancelling geostore fetch');
    }
  };

  render() {
    return null;
  }
}

reducerRegistry.registerModule('geostore', {
  actions,
  reducers,
  initialState
});
export default withRouter(connect(mapStateToProps, actions)(GeostoreProvider));
