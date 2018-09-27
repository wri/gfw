import { connect } from 'react-redux';

import { setAnalysisView } from 'components/map-v2/actions';

import * as ownActions from './actions';
import Component from './component';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

const actions = {
  setAnalysisView,
  ...ownActions
};

export const reduxModule = { actions: ownActions, reducers, initialState };

export default connect(getPopupProps, actions)(Component);
