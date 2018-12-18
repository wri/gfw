import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setModalMeta } from 'components/modals/meta/meta-actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import ModalSubscribeComponent from './component';
import { getModalSubscribeProps } from './selectors';

reducerRegistry.registerModule('modalSubscribe', {
  actions,
  reducers,
  initialState
});

export default connect(getModalSubscribeProps, { ...actions, setModalMeta })(
  ModalSubscribeComponent
);
