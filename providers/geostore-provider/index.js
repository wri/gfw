import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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

  const { adm0, adm1, adm2 } = location || {};

  useEffect(() => {
    if (adm0 || activeArea) {
      getGeostore(location);
    }

    if (!adm0) {
      clearGeostore();
    }
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
