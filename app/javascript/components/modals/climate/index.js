import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import { setContactUsModalOpen } from 'components/modals/contact-us/actions';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

reducerRegistry.registerModule('climateModal', {
  actions,
  reducers,
  initialState,
});

export default connect(({ climateModal }) => ({ ...climateModal }), {
  ...actions,
  setContactUsModalOpen,
})(Component);
