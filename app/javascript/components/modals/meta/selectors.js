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
  'map_service',
  'amazon_link',
];
const TABLE_FIELDS = [
  'function',
  'resolution',
  'geographic_coverage',
  'source',
  'frequency_of_updates',
  'date_of_content',
  'cautions',
  'license',
];

const selectModalMetaData = (state) => state?.modalMeta?.data;
const selectModalMetaLoading = (state) => state?.modalMeta?.loading;
const selectMetakey = (state) => state?.modalMeta?.settings?.metakey;

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
