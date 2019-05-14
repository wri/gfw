import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setMapSettings } from 'components/maps/map/actions';
import { setMapPromptsSettings } from 'components/maps/main-map/components/map-prompts/actions';
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
  setMapSettings,
  setMapPromptsSettings
})(MenuComponent);
