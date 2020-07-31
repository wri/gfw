import { connect } from 'react-redux';
import reducerRegistry from 'store/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

reducerRegistry.registerModule('map', {
  actions,
  reducers,
  initialState
});

export default connect(getMapProps, actions)(MapComponent);
