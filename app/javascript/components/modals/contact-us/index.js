import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapStateToProps = ({ modalContactus }) => ({
  open: modalContactus && modalContactus.open
});

reducerRegistry.registerModule('modalContactus', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, { ...actions })(Component);
