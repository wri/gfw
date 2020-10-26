import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { registerModule } from 'redux/store';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAreasProps } from './selectors';

const AreasProvider = ({
  loading,
  location,
  loggedIn,
  getAreasProvider,
  getAreaProvider,
}) => {
  registerModule({
    key: 'areas',
    reducers,
    initialState,
  });

  useEffect(() => {
    if (loggedIn) {
      getAreasProvider();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loading && !loggedIn && location?.type === 'aoi') {
      getAreaProvider(location.adm0);
    }
  }, [loggedIn, location, loading]);

  return null;
};

AreasProvider.propTypes = {
  getAreasProvider: PropTypes.func.isRequired,
  getAreaProvider: PropTypes.func.isRequired,
  loggedIn: PropTypes.bool,
  loading: PropTypes.bool,
  location: PropTypes.object,
};

export default connect(getAreasProps, actions)(AreasProvider);
