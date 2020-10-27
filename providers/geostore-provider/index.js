import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { cancelToken } from 'utils/request';
import { registerReducer } from 'redux/store';

import { getDataLocation } from 'utils/location';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = (state) => {
  const { location, areas } = state;

  return {
    location: getDataLocation(state),
    activeArea:
      areas &&
      areas.data &&
      areas.data.find((a) => a.id === (location && location.payload.adm0)),
  };
};

const GeostoreProvider = ({
  location,
  activeArea,
  clearGeostore,
  getGeostore,
}) => {
  registerReducer({
    key: 'geostore',
    reducers,
    initialState,
  });

  let geostoreFetch = null;
  const { adm0, adm1, adm2 } = location || {};

  useEffect(() => {
    if (adm0 || activeArea) {
      if (geostoreFetch) {
        geostoreFetch.cancel();
        clearGeostore({});
      }

      geostoreFetch = cancelToken();

      getGeostore({
        ...location,
        token: geostoreFetch.token,
      });
    }

    if (!adm0) {
      if (geostoreFetch) {
        geostoreFetch.cancel('Geostore cleared');
      }
      clearGeostore();
    }

    return () => {
      if (geostoreFetch) {
        geostoreFetch.cancel('Geostore unmounted');
      }
      clearGeostore();
    };
  }, [adm0, adm1, adm2, activeArea]);

  return null;
};

GeostoreProvider.propTypes = {
  location: PropTypes.object.isRequired,
  getGeostore: PropTypes.func.isRequired,
  clearGeostore: PropTypes.func.isRequired,
  activeArea: PropTypes.object,
};

export default connect(mapStateToProps, actions)(GeostoreProvider);
