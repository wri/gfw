import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

reducerRegistry.registerModule('contactUsModal', {
  actions,
  reducers,
  initialState
});

export default connect(({ contactUsModal }) => ({ ...contactUsModal }), actions)(Component);
