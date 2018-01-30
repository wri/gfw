import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';

// get list data
const getData = state => state.data || null;
const getLocation = state => state.location || null;
const getColors = state => state.colors || null;

const getSortedData = createSelector(
  [getData, getLocation, getColors],
  (data, location, colors) => {
    if (!data || isEmpty(data)) return null;

    console.log(data);
    console.log(location);
    console.log(colors);
    return null;
  }
);

export const getChartData = createSelector([getSortedData], data => {
  if (!data || !data.length) return null;
  const topRegions = data.length > 10 ? data.slice(0, 10) : data;
  const totalExtent = sumBy(data, 'extent');
  const otherRegions = data.length > 10 ? data.slice(10) : [];
  const othersExtent = otherRegions.length && sumBy(otherRegions, 'extent');
  const otherRegionsData = otherRegions.length
    ? {
      label: 'Other regions',
      percentage: othersExtent ? othersExtent / totalExtent * 100 : 0,
      color: otherRegions[0].color
    }
    : {};

  return [...topRegions, otherRegionsData];
});

export const getSentence = createSelector(
  [getSortedData, getLocation],
  (data, location) => {
    if (!data) return '';
    const sentence = '';

    return sentence;
  }
);
