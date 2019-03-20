import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setMainMapSettings } from 'pages/map/components/map/actions';
import { setMapSettings } from 'components/map/actions';
import { setMenuSettings } from 'pages/map/components/map/components/menu/menu-actions';
import * as actions from './actions';
import Component from './component';

import reducers, { initialState } from './reducers';
import { getMapTourProps } from './selectors';

reducerRegistry.registerModule('mapTour', {
  actions,
  reducers,
  initialState
});

export default connect(getMapTourProps, {
  ...actions,
  setMainMapSettings,
  setMenuSettings,
  setMapSettings
})(Component);
