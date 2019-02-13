import { connect } from 'react-redux';
import pick from 'lodash/pick';
import reducerRegistry from 'app/registry';

import * as actions from './meta-actions';
import reducers, { initialState } from './meta-reducers';
import ModalMetaComponent from './meta-component';

const MASTER_META_FIELDS = [
  'title',
  'subtitle',
  'citation',
  'overview',
  'learn_more',
  'download_data',
  'map_service',
  'amazon_link'
];
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

const mapStateToProps = ({ modalMeta, location }) => {
  const urlState = location && location.query && location.query.modalMeta;
  const { settings, data } = modalMeta || {};
  const allSettings = {
    ...settings,
    ...urlState
  };
  const { tableWhitelist, metaWhitelist, metakey } = allSettings;

  return {
    metakey,
    metaData: data && pick(data, metaWhitelist.length || MASTER_META_FIELDS),
    tableData: data && pick(data, tableWhitelist.length || MASTER_TABLE_FIELDS),
    loading: modalMeta && modalMeta.loading
  };
};

reducerRegistry.registerModule('modalMeta', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(ModalMetaComponent);
