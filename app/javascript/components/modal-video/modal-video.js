import { connect } from 'react-redux';

import actions from './modal-video-actions';
import reducers, { initialState } from './modal-video-reducers';
import ModalVideoComponent from './modal-video-component';

const mapStateToProps = ({ modalVideo }) => ({
  open: modalVideo.open,
  data: modalVideo.data
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ModalVideoComponent);
