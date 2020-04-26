import { connect } from 'react-redux';

import reducerRegistry from 'app/registry';

import { setMenuSettings } from 'components/map-menu/actions';

import Component from './component';
import * as actions from './actions';
import { getAOIModalProps } from './selectors';
import reducers, { initialState } from './reducers';

reducerRegistry.registerModule('areaModal', {
  actions,
  reducers,
  initialState,
});

export default connect(getAOIModalProps, { ...actions, setMenuSettings })(
  Component
);
