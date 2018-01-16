import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey, getColorPalette } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getIndicator = state => state.indicator || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.meta || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;

export const getSortedData = createSelector(
  [getData, getSettings, getLocation, getLocationsMeta],
  (data, settings, location, meta) => {
    if (!data || isEmpty(data) || !meta || isEmpty(meta)) return null;
    const dataMapped = [];
    data.forEach(d => {
      const region = meta.find(l => d.id === l.value);
      if (region) {
        dataMapped.push({
          label: (region && region.label) || '',
          extent: d.extent,
          percentage: d.percentage,
          value: settings.unit === 'ha' ? d.extent : d.percentage,
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
  [getSortedData, getColors],
  (data, colors) => {
    if (!data || !data.length) return null;
    const topRegions = data.length > 10 ? data.slice(0, 10) : data;
    const totalExtent = sumBy(data, 'extent');
    const otherRegions = data.length > 10 ? data.slice(10) : [];
    const othersExtent = otherRegions.length && sumBy(otherRegions, 'extent');
    const colorRange = getColorPalette(
      [colors.darkGreen, colors.nonForest],
      data.length > 10 ? topRegions.length + 1 : data.length
    );
    const topChartData = topRegions.map((d, index) => ({
      ...d,
      percentage: d.extent / totalExtent * 100,
      color: colorRange[index]
    }));
    const otherRegionsData = otherRegions.length
      ? {
        label: 'Other regions',
        percentage: othersExtent ? othersExtent / totalExtent * 100 : 0,
        color: colorRange[topRegions.length]
      }
      : {};

    return [...topChartData, otherRegionsData];
  }
);

export const getSentence = createSelector(
  [
    getSortedData,
    getSettings,
    getOptions,
    getLocation,
    getIndicator,
    getLocationNames
  ],
  (data, settings, options, location, indicator, locationNames) => {
    if (!data || !options || !indicator || !locationNames) return '';
    const { extentYear, threshold } = settings;
    const totalExtent = sumBy(data, 'extent');
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const topRegion = data.length && data[0];
    const avgExtentPercentage = sumBy(data, 'percentage') / data.length;
    const avgExtent = sumBy(data, 'extent');
    let percentileExtent = 0;
    let percentileLength = 0;
    let sentence = '';

    if (indicator.value !== 'gadm28') {
      sentence += `For <b>${
        indicator.label
      }</b> in <b>${currentLocation}</b>, `;
    } else {
      sentence += `In <b>${currentLocation}</b>, `;
    }
    while (
      percentileLength < data.length &&
      percentileExtent / totalExtent < 0.5
    ) {
      percentileExtent += data[percentileLength].extent;
      percentileLength += 1;
    }
    const topExtent = percentileExtent / totalExtent * 100;

    if (percentileLength > 1) {
      sentence += `the top <b>${percentileLength}</b> regions represents <b>`;
    } else {
      sentence += `<b>${topRegion.label}</b> represents <b>`;
    }
    if (!location.region) {
      sentence += `more than half (${format('.0f')(topExtent)}%)`;
    } else {
      sentence += `${format('.0f')(topExtent)}%`;
    }
    sentence += `</b> of all tree cover in <b>${extentYear}</b> where tree canopy is greater than <b>${threshold}%</b>. `;
    sentence += `${
      percentileLength > 1 ? `<b>${topRegion.label}</b>` : 'This region'
    } has the largest ${
      settings.unit === '%' ? 'relative' : ''
    } tree cover at `;
    if (topRegion.percentage > 1 && settings.unit === '%') {
      sentence += `<b>${format('.0f')(
        topRegion.percentage
      )}%</b> compared to an average of <b>${format('.0f')(
        avgExtentPercentage
      )}%</b>.`;
    } else {
      sentence += `<b>${format('.2s')(
        topRegion.extent
      )}ha</b> compared to an average of <b>${format('.2s')(avgExtent)}ha</b>.`;
    }

    return sentence;
  }
);
