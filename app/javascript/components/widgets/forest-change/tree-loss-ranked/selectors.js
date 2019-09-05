import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';

// get list data
const getData = state => state.data;
const getSettings = state => state.settings;
const getLocationsData = state => state.locationData;
const getColors = state => state.colors;
const getIndicator = state => state.indicator;
const getLocationObj = state => state.locationObj;
const getSentences = state => state && state.sentence;
const getTitle = state => state.title;
const getLocationName = state => state.type;

export const getSummedByYearsData = createSelector(
  [getData, getSettings, getLocationObj],
  (data, settings, location) => {
    if (isEmpty(data)) return null;
    const { loss, extent } = data;
    const filteredByYears = loss.filter(
      d => d.year >= settings.startYear && d.year <= settings.endYear
    );
    let regionKey = 'iso';
    if (location && location.adm1) regionKey = 'adm1';
    if (location && location.adm2) regionKey = 'adm2';
    const groupedByRegion = groupBy(filteredByYears, regionKey);
    const regions = Object.keys(groupedByRegion);
    const mappedData = regions.map(i => {
      const isoLoss = Math.round(sumBy(groupedByRegion[i], 'loss')) || 0;
      const regionExtent = extent.find(e => e[regionKey] === i);
      const isoExtent = (regionExtent && regionExtent.extent) || 1;
      const percentageLoss =
        isoExtent && isoLoss ? 100 * isoLoss / isoExtent : 0;

      return {
        id: location && location.adm1 ? parseInt(i, 10) : i,
        loss: isoLoss,
        extent: isoExtent,
        percentage: percentageLoss > 100 ? 100 : percentageLoss
      };
    });
    return sortByKey(
      uniqBy(mappedData, 'id'),
      settings.unit === 'ha' ? 'loss' : 'percentage',
      true
    ).map((d, i) => ({
      ...d,
      rank: i + 1
    }));
  }
);

export const sortData = createSelector(
  [getSummedByYearsData, getSettings],
  (data, settings) => {
    if (!data || !data.length) return null;
    return sortByKey(
      uniqBy(data, 'id'),
      settings.unit === 'ha' ? 'loss' : 'percentage',
      true
    );
  }
);

export const parseData = createSelector(
  [sortData, getSettings, getLocationObj, getLocationsData, getColors],
  (data, settings, locationObj, meta, colors) => {
    if (!data || !data.length) return null;
    let dataTrimmed = [];
    const { type, query, adm0 } = locationObj || {};

    data.forEach(d => {
      const locationMeta = meta && meta[d.id];
      if (locationMeta) {
        dataTrimmed.push({
          ...d,
          label: locationMeta.label
        });
      }
    });
    dataTrimmed = dataTrimmed.map((d, i) => ({
      ...d,
      rank: i + 1
    }));
    if (adm0) {
      const locationIndex = findIndex(
        dataTrimmed,
        d => d.id === locationObj.value
      );
      let trimStart = locationIndex - 2;
      let trimEnd = locationIndex + 3;
      if (locationIndex < 2) {
        trimStart = 0;
        trimEnd = 5;
      }
      if (locationIndex > dataTrimmed.length - 3) {
        trimStart = dataTrimmed.length - 5;
        trimEnd = dataTrimmed.length;
      }
      dataTrimmed = dataTrimmed.slice(trimStart, trimEnd);
    }
    return dataTrimmed.map(d => ({
      ...d,
      color: colors.main,
      path: {
        type,
        payload: {
          type: 'country',
          adm0: d.id
        },
        query: {
          ...query,
          map: {
            ...(query && query.map),
            canBound: true
          }
        }
      },
      value: settings.unit === 'ha' ? d.loss : d.percentage
    }));
  }
);

export const parseSentence = createSelector(
  [sortData, getSettings, getIndicator, getLocationObj, getSentences],
  (data, settings, indicator, locationObj, sentences) => {
    if (!data || !data.length || !locationObj) return null;
    const { startYear, endYear } = settings;
    const {
      initial,
      withIndicator,
      globalInitial,
      globalWithIndicator,
      noLoss
    } = sentences;
    const locationData =
      locationObj && data.find(l => l.id === locationObj.value);

    const loss = locationData && locationData.loss;
    const globalLoss = sumBy(data, 'loss') || 0;
    const globalExtent = sumBy(data, 'extent') || 0;
    const lossArea = locationObj.label === 'global' ? globalLoss : loss;
    const areaPercent =
      locationObj.label === 'global'
        ? 100 * globalLoss / globalExtent
        : (locationData && format('.1f')(locationData.percentage)) || 0;
    const lossPercent = loss && locationData ? 100 * loss / globalLoss : 0;
    const indicatorName = !indicator
      ? 'region-wide'
      : `${indicator.label.toLowerCase()}`;
    let sentence = !indicator ? initial : withIndicator;
    if (locationObj.label === 'global') {
      sentence = !indicator ? globalInitial : globalWithIndicator;
    }
    if (loss === 0) sentence = noLoss;
    const params = {
      indicator: indicatorName,
      location:
        locationObj.label === 'global'
          ? 'globally'
          : locationObj && locationObj.label,
      indicator_alt: indicatorName,
      startYear,
      endYear,
      loss: formatNumber({ num: lossArea, unit: 'ha' }),
      localPercent: formatNumber({ num: areaPercent, unit: '%' }),
      globalPercent: formatNumber({ num: lossPercent, unit: '%' }),
      extentYear: settings.extentYear
    };

    return {
      sentence,
      params
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationName],
  (title, name) => {
    let selectedTitle = title.default;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

export default createStructuredSelector({
  data: parseData,
  sentence: parseSentence,
  title: parseTitle
});
