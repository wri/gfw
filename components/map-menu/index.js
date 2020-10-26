import { connect } from 'react-redux';
import { registerReducer } from 'redux/store';

import { setMapSettings } from 'components/map/actions';
import { setMapPromptsSettings } from 'components/prompts/map-prompts/actions';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMenuProps } from './selectors';
import MenuComponent from './component';

const MenuContainer = (props) => {
  registerReducer({
    key: 'mapMenu',
    reducers,
    initialState,
  });

  return <MenuComponent {...props} />;
};

export default connect(getMenuProps, {
  ...actions,
  setMapSettings,
  setMapPromptsSettings,
})(MenuContainer);
