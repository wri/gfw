import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setMapSettings } from 'components/map/actions';
import { setMapPromptsSettings } from 'components/prompts/map-prompts/actions';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMenuProps } from './selectors';
import MenuComponent from './component';

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
