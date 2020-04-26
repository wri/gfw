import { connect } from 'react-redux';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import ModalVideoComponent from './component';

const mapStateToProps = ({ modalVideo }) => ({
  ...modalVideo,
});

reducerRegistry.registerModule('modalVideo', {
  actions,
  reducers,
  initialState,
});
export default connect(mapStateToProps, actions)(ModalVideoComponent);
