import { createSelector, createStructuredSelector } from 'reselect';
import pick from 'lodash/pick';

import { getGeodescriberTitleFull } from 'providers/geodescriber-provider/selectors';

const META_FIELDS = [
  'title',
  'subtitle',
  'citation',
  'overview',
  'learn_more',
  'download_data',
];
const TABLE_FIELDS = [
  'function',
  'resolution_description',
  'geographic_coverage',
  'source',
  'content_date',
  'content_date_description',
  'content_date_range',
  'update_frequency',
  'cautions',
  'license',
];

const selectModalMetaData = (state) => state.modalMeta && state.modalMeta.data;
const selectModalMetaLoading = (state) =>
  state.modalMeta && state.modalMeta.loading;
const selectMetakey = (state) => state.modalMeta?.metakey;

export const getMetadata = createSelector(
  [selectModalMetaData],
  (data) => data && pick(data, META_FIELDS)
);

export const getTableData = createSelector(
  [selectModalMetaData],
  (data) => data && pick(data, TABLE_FIELDS)
);

export const getMetaModalProps = createStructuredSelector({
  metaData: getMetadata,
  metakey: selectMetakey,
  tableData: getTableData,
  loading: selectModalMetaLoading,
  locationName: getGeodescriberTitleFull,
});
