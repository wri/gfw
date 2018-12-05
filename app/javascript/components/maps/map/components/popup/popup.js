import { connect } from 'react-redux';

import { setMainMapAnalysisView } from 'components/maps/main-map/actions';
import { setMapSettings } from 'components/maps/map/actions';

import * as ownActions from './actions';
import Component from './component';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

const actions = {
  setMainMapAnalysisView,
  setMapSettings,
  ...ownActions
};

export const reduxModule = { actions: ownActions, reducers, initialState };

export default connect(getPopupProps, actions)(Component);
