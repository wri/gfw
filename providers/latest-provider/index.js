import { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'redux/registry';

import * as actions from './actions';
import { getLatestProps } from './selectors';
import reducers, { initialState } from './reducers';

const LatestProvider = ({ latestEndpoints, getLatest }) => {
  const endpoint = useMemo(() => {
    return latestEndpoints;
  }, [latestEndpoints]);

  useEffect(() => {
    getLatest(endpoint);
  }, [endpoint]);

  return null;
};

LatestProvider.propTypes = {
  getLatest: PropTypes.func.isRequired,
  latestEndpoints: PropTypes.array,
};

reducerRegistry.registerModule('latest', {
  actions,
  reducers,
  initialState,
});

export default connect(getLatestProps, actions)(LatestProvider);
