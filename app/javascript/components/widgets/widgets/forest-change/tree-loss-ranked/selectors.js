import { createSelector, createStructuredSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

import { getAdminPath } from 'components/widgets/utils/strings';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.locationData || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getQuery = state => state.query || null;
const getLocationObject = state => state.locationObject || null;
const getSentences = state => state.config && state.config.sentence;
const getTitle = state => state.config.title;
const getLocationName = state => state.locationName || null;

export const getSummedByYearsData = createSelector(
  [getData, getSettings],
  (data, settings) => {
    if (isEmpty(data)) return null;
    const { loss, extent } = data;
    const filteredByYears = loss.filter(
      d => d.year >= settings.startYear && d.year <= settings.endYear
    );
    const groupedByIso = groupBy(filteredByYears, 'iso');
    const isos = Object.keys(groupedByIso);
    const mappedData = isos.map(i => {
      const isoLoss = sumBy(groupedByIso[i], 'loss') || 0;
      const isoExtent = extent.find(e => e.iso === i).extent;
      return {
        id: i,
        loss: isoLoss,
        extent: isoExtent,
        percentage: isoExtent ? 100 * isoLoss / isoExtent : 0
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
  [
    sortData,
    getSettings,
    getLocation,
    getLocationObject,
    getLocationsMeta,
    getColors,
    getQuery
  ],
  (data, settings, location, locationObject, meta, colors, query) => {
    if (!data || !data.length) return null;
    let dataTrimmed = [];
    data.forEach(d => {
      const locationMeta = meta && meta.find(l => d.id === l.value);
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
    if (location.adm0) {
      const locationIndex = findIndex(
        dataTrimmed,
        d => d.id === locationObject.value
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
      path: getAdminPath({
        ...location,
        adm0: location.adm1 && location.adm0,
        query,
        id: d.id
      }),
      value: settings.unit === 'ha' ? d.loss : d.percentage
    }));
  }
);

export const parseSentence = createSelector(
  [sortData, getSettings, getIndicator, getLocationObject, getSentences],
  (data, settings, indicator, locationObject, sentences) => {
    if (!data || !data.length || !locationObject) return null;
    const { startYear, endYear } = settings;
    const {
      initial,
      withIndicator,
      globalInitial,
      globalWithIndicator,
      noLoss
    } = sentences;
    const locationData =
      locationObject && data.find(l => l.id === locationObject.value);

    const loss = locationData && locationData.loss;
    const globalLoss = sumBy(data, 'loss');
    const globalExtent = sumBy(data, 'extent');
    const lossArea = locationObject.label === 'global' ? globalLoss : loss;
    const areaPercent =
      locationObject.label === 'global'
        ? 100 * globalLoss / globalExtent
        : (locationData && format('.1f')(locationData.percentage)) || 0;
    const lossPercent = loss && locationData ? 100 * loss / globalLoss : 0;
    const indicatorName = !indicator
      ? 'region-wide'
      : `${indicator.label.toLowerCase()}`;
    let sentence = !indicator ? initial : withIndicator;
    if (locationObject.label === 'global') {
      sentence = !indicator ? globalInitial : globalWithIndicator;
    }
    if (loss === 0) sentence = noLoss;
    const params = {
      indicator: indicatorName,
      location:
        locationObject.label === 'global'
          ? 'globally'
          : locationObject && locationObject.label,
      indicator_alt: indicatorName,
      startYear,
      endYear,
      loss:
        lossArea < 1
          ? `${format('.3r')(lossArea)}ha`
          : `${format('.3s')(lossArea)}ha`,
      localPercent:
        areaPercent >= 0.1 ? `${format('.2r')(areaPercent)}%` : '< 0.1%',
      globalPercent:
        lossPercent >= 0.1 ? `${format('.2r')(lossPercent)}%` : '< 0.1%',
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
