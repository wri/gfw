import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setRecentImagerySettings } from 'components/maps/main-map/components/recent-imagery/recent-imagery-actions';
import { setMapSettings } from 'components/maps/map/actions';
import * as actions from './menu-actions';
import reducers, { initialState } from './menu-reducers';
import { getMenuProps } from './menu-selectors';
import MenuComponent from './menu-component';

reducerRegistry.registerModule('mapMenu', {
  actions,
  reducers,
  initialState
});

export default connect(getMenuProps, {
  ...actions,
  setRecentImagerySettings,
  setMapSettings
})(MenuComponent);
