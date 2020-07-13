import { connect } from 'react-redux';

import reducerRegistry from 'app/registry';

import reducers, { initialState } from './reducers';
import * as actions from './actions';
import Component from './component';

const mapStateToProps = ({ contactUs }) => ({
  open: contactUs?.open,
});

reducerRegistry.registerModule('contactUs', {
  actions,
  reducers,
  initialState,
});

export default connect(mapStateToProps, actions)(Component);
