import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setMapPromptsSettings } from 'components/maps/main-map/components/map-prompts/actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapStateToProps = ({ modalWelcome }) => ({
  open: modalWelcome && modalWelcome.open
});

reducerRegistry.registerModule('modalWelcome', {
  actions,
  reducers,
  initialState
});
export default connect(mapStateToProps, { ...actions, setMapPromptsSettings })(
  Component
);
