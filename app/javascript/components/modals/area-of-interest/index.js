import { connect } from 'react-redux';

import { setMenuSettings } from 'components/map-menu/actions';

import reducerRegistry from 'app/registry';

import Component from './component';
import reducers, { initialState } from './reducers';
import * as actions from './actions';
import { getAOIModalProps } from './selectors';

reducerRegistry.registerModule('areaOfInterestModal', {
  actions,
  reducers,
  initialState,
});

export default connect(getAOIModalProps, { ...actions, setMenuSettings })(
  Component
);
