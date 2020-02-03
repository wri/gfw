import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import ModalMetaComponent from './component';
import { getMetaModalProps } from './selectors';

reducerRegistry.registerModule('modalMeta', {
  actions,
  reducers,
  initialState
});

export default connect(getMetaModalProps, actions)(ModalMetaComponent);
