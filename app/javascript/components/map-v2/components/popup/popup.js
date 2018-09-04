import { connect } from 'react-redux';

import Component from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

export { actions, reducers, initialState };

export default connect(getPopupProps, actions)(Component);
