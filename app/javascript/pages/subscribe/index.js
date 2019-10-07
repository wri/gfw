import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getSubscriptionFormProps } from './selectors';
import PageComponent from './component';

reducerRegistry.registerModule('subscriptionForm', {
  actions,
  reducers,
  initialState
});
export default connect(getSubscriptionFormProps, {
  ...actions
})(PageComponent);

// export default PageComponent;
