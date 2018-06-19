import { connect } from 'react-redux';
import pick from 'lodash/pick';

import actions from './meta-actions';
import reducers, { initialState } from './meta-reducers';
import ModalMetaComponent from './meta-component';

const MASTER_META_FIELDS = ['title', 'subtitle', 'citation', 'overview'];
const MASTER_TABLE_FIELDS = [
  'function',
  'resolution',
  'geographic_coverage',
  'source',
  'frequency_of_updates',
  'date_of_content',
  'cautions',
  'license'
];

const mapStateToProps = ({ modalMeta }) => ({
  open: modalMeta.open,
  metaData: pick(
    modalMeta.data,
    modalMeta.data.metaWhitelist || MASTER_META_FIELDS
  ),
  tableData: pick(
    modalMeta.data,
    modalMeta.data.tableWhitelist || MASTER_TABLE_FIELDS
  ),
  loading: modalMeta.loading
});

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(ModalMetaComponent);
