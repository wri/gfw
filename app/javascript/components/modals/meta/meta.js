import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './meta-actions';
import reducers, { initialState } from './meta-reducers';
import ModalMetaComponent from './meta-component';
import { getMetaModalProps } from './meta-selectors';

reducerRegistry.registerModule('modalMeta', {
  actions,
  reducers,
  initialState
});

export default connect(getMetaModalProps, actions)(ModalMetaComponent);
