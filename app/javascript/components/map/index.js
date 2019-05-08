import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { getGeostoreId } from 'providers/geostore-provider/actions';
import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import { getMapProps } from './selectors';
import MapComponent from './component';

const actions = {
  ...ownActions,
  getGeostoreId
};

reducerRegistry.registerModule('map', {
  actions,
  reducers,
  initialState
});

export default connect(getMapProps, actions)(MapComponent);
