import { createSelector } from 'reselect';
import uniqBy from 'lodash/uniqBy';
import findIndex from 'lodash/findIndex';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getData = state => state.data || null;
const getSettings = state => state.settings || null;
const getLocation = state => state.payload || null;
const getLocationsMeta = state => state.countries || null;
const getColors = state => state.colors || null;
const getIndicator = state => state.indicator || null;
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
    ).map((d, i) => ({
      ...d,
      rank: i + 1
    }));
  }
);

export const parseData = createSelector(
  [
    sortData,
    getSettings,
    getLocation,
    getCurrentLocation,
    getLocationsMeta,
    getColors
  ],
  (data, settings, location, currentLocation, meta, colors) => {
    if (!data || !data.length) return null;
    const locationIndex = findIndex(
      data,
      d => d.id === (currentLocation && currentLocation.value)
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
    return dataTrimmed.map(d => {
      const locationData = meta && meta.find(l => d.id === l.value);
      let path = '/dashboards/country/';
      if (location.subRegion) {
        path += `${location.country}/${location.region}/${d.id}`;
      } else if (location.region) {
        path += `${location.country}/${d.id}`;
      } else {
        path += d.id;
      }

      return {
        ...d,
        label: (locationData && locationData.label) || '',
        color: colors.main,
        path,
        value: settings.unit === 'ha' ? d.loss : d.percentage
      };
    });
  }
);

export const getSentence = createSelector(
  [sortData, getSettings, getIndicator, getCurrentLocation, getSentences],
  (data, settings, indicator, currentLocation, sentences) => {
    if (!data || !data.length || !currentLocation) return null;
    const { startYear, endYear } = settings;
    const { initial, withIndicator, noLoss } = sentences;
    const locationData =
      currentLocation && data.find(l => l.id === currentLocation.value);
    const loss = locationData && locationData.loss;
    const areaPercent =
      (locationData && format('.1f')(locationData.percentage)) || 0;
    const globalPercent =
      loss && locationData ? 100 * loss / sumBy(data, 'loss') : 0;
    const indicatorName = !indicator
      ? 'region-wide'
      : `${indicator.label.toLowerCase()}`;
    let sentence = !indicator ? initial : withIndicator;
    if (loss === 0) {
      sentence = noLoss;
    }
    const params = {
      indicator: indicatorName,
      location: currentLocation && currentLocation.label,
      indicator_alt: indicatorName,
      startYear,
      endYear,
      loss: loss < 1 ? `${format('.3r')(loss)}ha` : `${format('.3s')(loss)}ha`,
      percent: areaPercent >= 0.1 ? `${format('.2r')(areaPercent)}%` : '<0.1%',
      globalPercent:
        globalPercent >= 0.1 ? `${format('.2r')(globalPercent)}%` : '<0.1%',
      extentYear: settings.extentYear
    };

    return {
      sentence,
      params
    };
  }
);
