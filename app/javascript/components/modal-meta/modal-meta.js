import { connect } from 'react-redux';
import pick from 'lodash/pick';

import actions from './modal-meta-actions';
import reducers, { initialState } from './modal-meta-reducers';
import ModalMetaComponent from './modal-meta-component';

const MASTER_TABLE_FIELDS = ['function', 'source'];

const mapStateToProps = ({ modalMeta }) => ({
  open: modalMeta.open,
  metaData: pick(modalMeta.data, ['title', 'subtitle', 'citation', 'overview']),
  tableData: pick(modalMeta.data, MASTER_TABLE_FIELDS),
  loading: modalMeta.loading
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ModalMetaComponent);
