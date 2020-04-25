import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import ModalProfileComponent from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import getModalAOIProps from './selectors';

reducerRegistry.registerModule('profileModal', {
  actions,
  reducers,
  initialState
});

export default connect(getModalAOIProps, actions)(ModalProfileComponent);
