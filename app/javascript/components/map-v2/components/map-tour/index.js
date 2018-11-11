import { connect } from 'react-redux';

import { setAnalysisSettings } from 'components/map-v2/components/analysis/actions';
import { setMenuSettings } from 'pages/map/components/menu/menu-actions';
import * as actions from './actions';
import Component from './component';

import reducers, { initialState } from './reducers';
import { getMapTourProps } from './selectors';

export const reduxModule = { actions, reducers, initialState };
export default connect(getMapTourProps, {
  ...actions,
  setAnalysisSettings,
  setMenuSettings
})(Component);
