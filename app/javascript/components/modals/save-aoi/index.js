import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setModalMetaSettings } from 'components/modals/meta/meta-actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import ModalSaveAOIComponent from './component';
import { getModalAOIProps } from './selectors';

reducerRegistry.registerModule('modalSaveAOI', {
  actions,
  reducers,
  initialState
});
export default connect(getModalAOIProps, {
  ...actions,
  setModalMetaSettings
})(ModalSaveAOIComponent);
