import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';
import withRouter from 'utils/withRouter';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

reducerRegistry.registerModule('map', {
  actions,
  reducers,
  initialState
});

export default withRouter(connect(getMapProps, actions)(MapComponent));
