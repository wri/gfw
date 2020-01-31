import { connect } from 'react-redux';
import pick from 'lodash/pick';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import ModalMetaComponent from './component';

const META_FIELDS = [
  'title',
  'subtitle',
  'citation',
  'overview',
  'learn_more',
  'download_data',
  'map_service',
  'amazon_link'
];
const TABLE_FIELDS = [
  'function',
  'resolution',
  'geographic_coverage',
  'source',
  'frequency_of_updates',
  'date_of_content',
  'cautions',
  'license'
];

const mapStateToProps = ({ modalMeta, location }) => {
  const metakey = location && location.query && location.query.modalMeta;
  const { data } = modalMeta || {};

  return {
    metakey,
    metaData: data && pick(data, META_FIELDS),
    tableData: data && pick(data, TABLE_FIELDS),
    loading: modalMeta && modalMeta.loading
  };
};

reducerRegistry.registerModule('modalMeta', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(ModalMetaComponent);
