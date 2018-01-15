import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey, getColorPalette } from 'utils/data';

// get list data
const getData = state => state.data || null;
const getUnit = state => state.unit || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getColors = state => state.colors || null;

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
          extent: d.extent,
          percentage: d.percentage,
          value: unit === 'ha' ? d.extent : d.percentage,
          path: `/country/${location.country}/${
            location.region ? `${location.region}/` : ''
          }${d.id}`
        });
      }
    });
    return sortByKey(uniqBy(dataMapped, 'label'), 'value', true);
  }
);

export const getChartData = createSelector(
  [getSortedData, getUnit, getColors],
  (data, unit, colors) => {
    if (!data || !data.length) return null;
    const topRegions = data.length > 10 ? data.slice(0, 10) : data;
    const totalExtent = sumBy(data, 'extent');
    const otherRegions = data.length > 10 ? data.slice(10) : [];
    const othersExtent = otherRegions.length && sumBy(otherRegions, 'extent');
    const colorRange = getColorPalette([colors.darkGreen, colors.nonForest], topRegions.length);
    const topChartData = topRegions.map((d, index) => ({
      ...d,
      percentage: d.extent / totalExtent * 100,
      color: colorRange[index]
    }));
    const otherRegionsData = otherRegions.length ? {
      label: 'Other regions',
      percentage: othersExtent ? othersExtent / totalExtent * 100 : 0,
      color: colors.grey
    } : {};

    return [
      ...topChartData,
      otherRegionsData
    ];
  }
);
