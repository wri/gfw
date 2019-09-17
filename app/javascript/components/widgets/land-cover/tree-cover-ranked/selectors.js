import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';
import sumBy from 'lodash/sumBy';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.allLocation || null;
const getLocationData = state => state.locationData || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getLocationObject = state => state.locationObject || null;
const getSentences = state => state.sentences || null;
const getForestType = state => state.forestType || null;
const getLandCategory = state => state.landCategory || null;

export const getSortedData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;
    return sortByKey(
      uniqBy(data, 'id'),
      settings.unit === 'ha' ? 'extent' : 'percentage',
      true
    ).map((d, i) => ({
      ...d,
      rank: i + 1
    }));
  }
);

export const parseData = createSelector(
  [
    getSortedData,
    getSettings,
    getLocation,
    getLocationObject,
    getLocationData,
    getColors
  ],
  (data, settings, location, locationObject, meta, colors) => {
    if (!data || !data.length || !locationObject || !meta) return null;
    const locationIndex = findIndex(
      data,
      d => d.id === (locationObject && locationObject && locationObject.value)
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
    const { query, payload, type } = location;
    return dataTrimmed.map(d => {
      const locationData = meta && meta.find(l => d.id === l.value);

      return {
        ...d,
        label: (locationData && locationData.label) || '',
        color: colors.main,
        path: {
          type,
          payload: {
            ...payload,
            adm0: locationData && locationData.value
          },
          query: {
            ...query,
            map: {
              ...(query && query.map),
              canBound: true
            }
          }
        },
        value: settings.unit === 'ha' ? d.extent : d.percentage
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
    getForestType,
    getLandCategory,
    getLocationObject,
    getSentences
  ],
  (
    rawData,
    data,
    settings,
    indicator,
    forestType,
    landCategory,
    locationObject,
    sentences
  ) => {
    if (!data || !data.length || !locationObject) return null;
    const { initial, withInd, landCatOnly } = sentences;
    const locationData =
      locationObject && data.find(l => l.id === locationObject.value);
    const extent = locationData && locationData.extent;
    const landPercent = (locationData && 100 * extent / locationData.area) || 0;
    const globalPercent = 100 * extent / sumBy(rawData, 'extent') || 0;
    const params = {
      extentYear: settings.extentYear,
      location: locationObject.label,
      extent:
        extent < 1
          ? `${format('.3r')(extent)}ha`
          : `${format('.3s')(extent)}ha`,
      indicator: indicator && indicator.label.toLowerCase(),
      landPercentage:
        landPercent >= 0.1 ? `${format('.2r')(landPercent)}%` : '< 0.1%',
      globalPercentage:
        globalPercent >= 0.1 ? `${format('.2r')(globalPercent)}%` : '< 0.1%'
    };

    let sentence = indicator ? withInd : initial;
    if (!forestType && landCategory) sentence = landCatOnly;

    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence
});
