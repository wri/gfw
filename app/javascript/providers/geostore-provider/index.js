import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { cancelToken } from 'utils/request';
import { getDataLocation } from 'utils/location';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = (state) => ({
  activeArea: state?.areas?.data?.find((a) => a.id === state?.location?.adm0),
  location: getDataLocation(state),
});

class GeostoreProvider extends PureComponent {
  static propTypes = {
    getGeostore: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    clearGeostore: PropTypes.func.isRequired,
    activeArea: PropTypes.object,
  };

  componentDidMount() {
    const { activeArea, location } = this.props;
    const { adm0, type } = location || {};
    if ((adm0 && type !== 'aoi') || (type === 'aoi' && activeArea)) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps) {
    const { activeArea, clearGeostore } = this.props;
    const { adm0, adm1, adm2 } = location || {};
    const hasAdm0Changed = adm0 && adm0 !== prevProps?.location?.adm0;
    const hasAdm1Changed = adm0 && adm1 !== prevProps?.location?.adm1;
    const hasAdm2Changed = adm0 && adm1 && adm2 !== prevProps?.location?.adm2;
    const hasAoiChanged =
      activeArea && !isEqual(activeArea, prevProps.activeArea);

    if (!adm0 && adm0 !== prevProps?.location?.adm0) {
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
      ...this.props?.location,
      token: this.geostoreFetch.token,
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
  initialState,
});

export default connect(mapStateToProps, actions)(GeostoreProvider);
