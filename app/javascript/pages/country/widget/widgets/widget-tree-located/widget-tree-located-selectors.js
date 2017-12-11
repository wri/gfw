import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getPage = state => state.page || null;
const getPageSize = state => state.pageSize || null;
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
          ...d,
          label: (location && location.label) || ''
        });
      }
    });
    return sortByKey(dataMapped, unit === 'ha' ? 'area' : 'percentage');
  }
);

// get lists selected
export const filterData = createSelector(
  [getSortedData, getPage, getPageSize],
  (data, page, pageSize) => {
    if (isEmpty(data) || !data.length) return null;
    return data.slice(page * pageSize, page * pageSize + pageSize);
  }
);
