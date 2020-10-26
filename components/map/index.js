import { connect } from 'react-redux';

import { registerReducer } from 'redux/store';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

const MapContainer = (props) => {
  registerReducer({
    key: 'map',
    reducers,
    initialState,
  });

  return <MapComponent {...props} />;
};

export default connect(getMapProps, actions)(MapContainer);
