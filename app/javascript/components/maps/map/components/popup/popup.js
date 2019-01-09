import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

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

reducerRegistry.registerModule('popup', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(getPopupProps, actions)(Component);
