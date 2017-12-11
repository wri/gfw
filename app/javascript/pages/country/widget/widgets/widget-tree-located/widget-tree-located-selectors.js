import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getUnit = state => state.unit || null;
const getLocationsMeta = state => state.meta || null;

export const getSortedData = createSelector(
  [getData, getUnit, getLocationsMeta],
  (data, unit, meta) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const location = meta.find(l => d.id === l.value);
      if (location) {
        dataMapped.push({
          label: (location && location.label) || '',
          value: unit === 'ha' ? d.area : d.percentage
        });
      }
    });
    return sortByKey(dataMapped, 'value', true);
  }
);
