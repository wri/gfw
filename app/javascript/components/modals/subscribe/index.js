import { connect } from 'react-redux';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import ModalSubscribeComponent from './component';
import { getModalSubscribeProps } from './selectors';

export const reduxModule = { actions, reducers, initialState };
export default connect(getModalSubscribeProps, actions)(
  ModalSubscribeComponent
);
