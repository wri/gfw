import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import { sortByKey } from 'utils/data';

// get list data
const getData = state => state.ranking || null;
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
      let path = '/country/';
      if (location.subRegion) {
        path += `${location.country}/${location.region}/${d.id}`;
      } else if (location.region) {
        path += `${location.country}/${d.id}`;
      } else {
        path += d.id;
      }

      if (region) {
        dataMapped.push({
          label: (region && region.label) || '',
          value: unit === 'ha' ? d.gain : d.relative,
          path
        });
      }
    });
    return sortByKey(uniqBy(dataMapped, 'label'), 'value', true);
  }
);
