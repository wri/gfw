import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import ModalSaveAOIComponent from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getModalAOIProps } from './selectors';

reducerRegistry.registerModule('modalSaveAOI', {
  actions,
  reducers,
  initialState
});

export default connect(getModalAOIProps, actions)(ModalSaveAOIComponent);
