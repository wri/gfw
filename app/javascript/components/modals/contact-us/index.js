import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapStateToProps = ({ modalContactus, location }) => ({
  open: location && location.query && location.query.contactUs !== 'false',
  showConfirm: modalContactus && modalContactus.showConfirm,
  submitting: modalContactus && modalContactus.submitting
});

reducerRegistry.registerModule('modalContactus', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, { ...actions })(Component);
