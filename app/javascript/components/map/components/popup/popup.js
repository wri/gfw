import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setMapSettings } from 'components/map/actions';
import { getGeostoreId } from 'components/map/components/draw/actions';
import * as ownActions from './actions';
import Component from './component';
import reducers, { initialState } from './reducers';
import { getPopupProps } from './selectors';

import './styles.scss';

const actions = {
  setMapSettings,
  getGeostoreId,
  ...ownActions
};

reducerRegistry.registerModule('popup', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(getPopupProps, actions)(Component);
