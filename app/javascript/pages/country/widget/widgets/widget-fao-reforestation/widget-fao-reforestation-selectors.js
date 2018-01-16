import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import { sortByKey, getColorPalette } from 'utils/data';

const getData = state => state.data || null;
const getLocation = state => state.location || null;
const getColors = state => state.colors || null;

export const getSortedData = createSelector([getData], data => {
  if (!data || !data.length) return null;
  return sortByKey(uniqBy(data, 'iso'), 'rate', true).map((d, i) => ({
    ...d,
    rank: i + 1
  }));
});

export const getFilteredData = createSelector(
  [getSortedData, getLocation, getColors],
  (data, location, colors) => {
    if (!data || !data.length) return null;
    const locationIndex = findIndex(data, d => d.iso === location.country);
    const dataTrimmed = data.slice(locationIndex - 2, locationIndex + 3);
    const colorRange = getColorPalette(
      [colors.darkGreen, colors.lightGreen],
      dataTrimmed.length
    );
    return dataTrimmed.map((d, index) => ({
      ...d,
      label: d.name,
      color: colorRange[index],
      path: `/country/${d.iso}`
    }));
  }
);

export const getLocationData = createSelector(
  [getData, getLocation],
  (data, location) => {
    if (!data || !data.length) return null;
    return data.find(d => location.country === d.iso) || null;
  }
);
