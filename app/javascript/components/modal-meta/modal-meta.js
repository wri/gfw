import { connect } from 'react-redux';

import actions from './modal-meta-actions';
import reducers, { initialState } from './modal-meta-reducers';
import ModalMetaComponent from './modal-meta-component';

const mapStateToProps = ({ modalMeta }) => ({
  open: modalMeta.open,
  data: modalMeta.data,
  loading: modalMeta.loading
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ModalMetaComponent);
