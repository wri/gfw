import { connect } from 'react-redux';

import * as mapActions from 'components/map/actions';

import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import { getDashboardsProps } from './selectors';
import Component from './component';

const actions = { ...mapActions, ...ownActions };

export const reduxModule = { actions, reducers, initialState };

export default connect(getDashboardsProps, actions)(Component);
