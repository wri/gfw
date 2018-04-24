import { connect } from 'react-redux';

import actions from './video-actions';
import reducers, { initialState } from './video-reducers';
import ModalVideoComponent from './video-component';

const mapStateToProps = ({ modalVideo }) => ({
  open: modalVideo.open,
  data: modalVideo.data
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ModalVideoComponent);
