import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';
import withRouter from 'utils/withRouter';

import * as actions from './actions';
import getSearchProps from './selectors';
import Component from './component';
import reducers, { initialState } from './reducers';

reducerRegistry.registerModule('search', {
  actions,
  reducers,
  initialState,
});

export default withRouter(connect(getSearchProps, actions)(Component));
