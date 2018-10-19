import { connect } from 'react-redux';

import * as actions from './menu-actions';
import reducers, { initialState } from './menu-reducers';
import { getMenuProps } from './menu-selectors';
import MenuComponent from './menu-component';

export const reduxModule = { actions, reducers, initialState };
export default connect(getMenuProps, actions)(MenuComponent);
