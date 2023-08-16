import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';
import sumBy from 'lodash/sumBy';

// get list data
const getData = (state) => state.data;
const getSettings = (state) => state.settings;
const getLocationData = (state) => state.locationData;
const getColors = (state) => state.colors;
const getIndicator = (state) => state.indicator;
const getLocationObject = (state) => state.location;
const getSentences = (state) => state.sentences;

export const getSortedData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;
    return sortBy(
      uniqBy(data, 'id'),
      settings.unit === 'ha' ? 'extent' : 'percentage'
    )
      .reverse()
      .map((d, i) => ({
        ...d,
        rank: i + 1,
      }));
  }
);

export const parseData = createSelector(
  [getSortedData, getSettings, getLocationObject, getLocationData, getColors],
  (data, settings, locationObject, meta, colors) => {
    if (!data || !data.length || !locationObject || !meta) return null;
    const locationIndex = findIndex(
      data,
      (d) => d.id === (locationObject && locationObject && locationObject.value)
    );
    let trimStart = locationIndex - 2;
    let trimEnd = locationIndex + 3;
    if (locationIndex < 2) {
      trimStart = 0;
      trimEnd = 5;
    }
    if (locationIndex > data.length - 3) {
      trimStart = data.length - 5;
      trimEnd = data.length;
    }
    const dataTrimmed = data.slice(trimStart, trimEnd);
    return dataTrimmed.map((d) => {
      const locationData = meta && meta[d.id];

      return {
        ...d,
        label: (locationData && locationData.label) || '',
        color: colors.main,
        value: settings.unit === 'ha' ? d.extent : d.percentage,
      };
    });
  }
);

export const parseSentence = createSelector(
  [
    getData,
    parseData,
    getSettings,
    getIndicator,
    getLocationObject,
    getSentences,
  ],
  (rawData, data, settings, indicator, locationObject, sentences) => {
    if (!data || !data.length || !locationObject) return null;
    const { forestType, landCategory } = settings;
    const { initial, withInd, landCatOnly } = sentences;
    const locationData =
      locationObject && data.find((l) => l.id === locationObject.value);
    const extent = locationData && locationData.extent;
    const landPercent =
      (locationData && (100 * extent) / locationData.area) || 0;
    const globalPercent = (100 * extent) / sumBy(rawData, 'extent') || 0;
    const params = {
      extentYear: settings.extentYear,
      location: locationObject.label,
      extent: formatNumber({ num: extent, unit: 'ha', spaceUnit: true }),
      indicator: indicator && indicator.label,
      landPercentage: formatNumber({ num: landPercent, unit: '%' }),
      globalPercentage: formatNumber({ num: globalPercent, unit: '%' }),
    };

    let sentence = indicator ? withInd : initial;
    if (!forestType && landCategory) sentence = landCatOnly;

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
});
