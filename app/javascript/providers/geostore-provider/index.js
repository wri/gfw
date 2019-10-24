import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CancelToken } from 'axios';
import isEqual from 'lodash/isEqual';
import reducerRegistry from 'app/registry';

import { getDataLocation } from 'utils/location';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = state => {
  const { location, areas } = state;

  return {
    location: getDataLocation(state),
    activeArea:
      areas &&
      areas.data &&
      areas.data.find(a => a.id === (location && location.payload.adm0))
  };
};

class GeostoreProvider extends PureComponent {
  componentDidMount() {
    const { location: { adm0, type }, activeArea } = this.props;

    if ((adm0 && type !== 'aoi') || (type === 'aoi' && activeArea)) {
      this.handleGetGeostore();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location: { adm0, adm1, adm2 },
      activeArea,
      clearGeostore
    } = this.props;
    const hasAdm0Changed = adm0 && adm0 !== prevProps.location.adm0;
    const hasAdm1Changed = adm0 && adm1 !== prevProps.location.adm1;
    const hasAdm2Changed = adm0 && adm1 && adm2 !== prevProps.location.adm2;
    const hasAoiChanged =
      activeArea && !isEqual(activeArea, prevProps.activeArea);

    if (!adm0 && adm0 !== prevProps.location.adm0) {
      this.cancelGeostoreFetch();
      clearGeostore({});
    }

    if (hasAdm0Changed || hasAdm1Changed || hasAdm2Changed || hasAoiChanged) {
      this.handleGetGeostore();
    }
  }

  handleGetGeostore = () => {
    const { activeArea } = this.props;
    this.cancelGeostoreFetch();
    this.geostoreFetch = CancelToken.source();
    this.props.getGeostore({
      ...this.props.location,
      ...(activeArea && {
        type: 'geostore',
        adm0: activeArea.geostore
      }),
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

GeostoreProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getGeostore: PropTypes.func.isRequired,
  clearGeostore: PropTypes.func.isRequired,
  activeArea: PropTypes.object
};

reducerRegistry.registerModule('geostore', {
  actions,
  reducers,
  initialState
});
export default connect(mapStateToProps, actions)(GeostoreProvider);
