import { connect } from 'react-redux';

import reducerRegistry from 'app/registry';

import ModalProfileComponent from './component';
import reducers, { initialState } from './reducers';
import * as actions from './actions';
import { getModalAOIProps } from './selectors';

reducerRegistry.registerModule('profile', {
  actions,
  reducers,
  initialState,
});

export default connect(getModalAOIProps, actions)(ModalProfileComponent);
