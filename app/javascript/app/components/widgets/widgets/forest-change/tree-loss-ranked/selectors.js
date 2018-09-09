import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

import { getAdminPath } from '../../../utils';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.location || null;
const getLocationsMeta = state => state.countries || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
const getQuery = state => state.query || null;
const getCurrentLocation = state => state.currentLocation || null;
const getSentences = state => state.config && state.config.sentences;

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
      const isoExtent = extent.find(e => e.iso === i).value;
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
    getCurrentLocation,
    getLocationsMeta,
    getColors,
    getQuery
  ],
  (data, settings, location, currentLocation, meta, colors, query) => {
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
    if (location.country) {
      const locationIndex = findIndex(
        dataTrimmed,
        d => d.id === currentLocation.value
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
        country: location.region && location.country,
        query,
        id: d.id
      }),
      value: settings.unit === 'ha' ? d.loss : d.percentage
    }));
  }
);

export const getSentence = createSelector(
  [sortData, getSettings, getIndicator, getCurrentLocation, getSentences],
  (data, settings, indicator, currentLocation, sentences) => {
    if (!data || !data.length || !currentLocation) return null;
    const { startYear, endYear } = settings;
    const {
      initial,
      withIndicator,
      globalInitial,
      globalWithIndicator,
      noLoss
    } = sentences;
    const locationData =
      currentLocation && data.find(l => l.id === currentLocation.value);

    const loss = locationData && locationData.loss;
    const globalLoss = sumBy(data, 'loss');
    const globalExtent = sumBy(data, 'extent');
    const lossArea = currentLocation.label === 'global' ? globalLoss : loss;
    const areaPercent =
      currentLocation.label === 'global'
        ? 100 * globalLoss / globalExtent
        : (locationData && format('.1f')(locationData.percentage)) || 0;
    const lossPercent = loss && locationData ? 100 * loss / globalLoss : 0;
    const indicatorName = !indicator
      ? 'region-wide'
      : `${indicator.label.toLowerCase()}`;
    let sentence = !indicator ? initial : withIndicator;
    if (currentLocation.label === 'global') {
      sentence = !indicator ? globalInitial : globalWithIndicator;
    }
    if (loss === 0) sentence = noLoss;
    const params = {
      indicator: indicatorName,
      location:
        currentLocation.label === 'global'
          ? 'globally'
          : currentLocation && currentLocation.label,
      indicator_alt: indicatorName,
      startYear,
      endYear,
      loss:
        lossArea < 1
          ? `${format('.3r')(lossArea)}ha`
          : `${format('.3s')(lossArea)}ha`,
      localPercent:
        areaPercent >= 0.1 ? `${format('.2r')(areaPercent)}%` : '<0.1%',
      globalPercent:
        lossPercent >= 0.1 ? `${format('.2r')(lossPercent)}%` : '<0.1%',
      extentYear: settings.extentYear
    };

    return {
      sentence,
      params
    };
  }
);
