import { connect } from 'react-redux';

import * as actions from './actions';
import getSearchProps from './selectors';
import Component from './component';
import reducers, { initialState } from './reducers';

export const reduxModule = {
  actions,
  reducers,
  initialState,
};

export default connect(getSearchProps, actions)(Component);
