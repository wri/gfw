import { connect } from 'react-redux';

import reducerRegistry from 'store/registry';

import reducers, { initialState } from './reducers';
import * as actions from './actions';
import Component from './component';

const mapStateToProps = ({ planetNotice }) => ({
  open: planetNotice?.open,
});

reducerRegistry.registerModule('planetNotice', {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(Component);
