import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getUnit = state => state.unit || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;

export const getSortedData = createSelector(
  [getData, getUnit, getLocation, getLocationsMeta],
  (data, unit, location, meta) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      if (region) {
        dataMapped.push({
          label: (region && region.label) || '',
          value: unit === 'ha' ? d.area : d.percentage,
          path: `/country/${location.country}/${
            location.region ? `${location.region}/` : ''
          }${d.id}`
        });
      }
    });
    return sortByKey(uniqBy(dataMapped, 'label'), 'value', true);
  }
);
