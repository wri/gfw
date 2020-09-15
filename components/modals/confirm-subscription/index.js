import { connect } from 'react-redux';

import reducerRegistry from 'redux/registry';

import Component from './component';
import reducers, { initialState } from './reducers';
import * as actions from './actions';
import { getConfirmSubscriptionModalProps } from './selectors';

reducerRegistry.registerModule('confirmSubscription', {
  actions,
  reducers,
  initialState,
});

export default connect(getConfirmSubscriptionModalProps, actions)(Component);
