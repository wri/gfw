import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';

const mapStateToProps = ({ modalGFWFires, location }) => ({
  open: modalGFWFires?.open,
  location,
});

reducerRegistry.registerModule('modalGFWFires', {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(Component);
