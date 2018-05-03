import { createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import { sortByKey } from 'utils/data';
import { format } from 'd3-format';

// get list data
const getLoss = state => (state.data && state.data.lossByRegion) || null;
const getExtent = state => (state.data && state.data.extent) || null;
const getSettings = state => state.settings || null;
const getOptions = state => state.options || null;
const getActiveIndicator = state =>
  (state.optionsSelected && state.optionsSelected.indicator) || null;
const getLocation = state => state.payload || null;
const getLocationsMeta = state =>
  (state.payload.region ? state.subRegions : state.regions) || null;
const getLocationNames = state => state.locationNames || null;
const getColors = state => state.colors || null;
const getSentences = state => state.config && state.config.sentences;

export const mapData = createSelector(
  [getLoss, getExtent, getSettings, getLocation, getLocationsMeta],
  (data, extent, settings, location, meta) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const { startYear, endYear } = settings;
    const mappedData = data.map(d => {
      const region = meta.find(l => d.id === l.value);
      const loss =
        sumBy(
          d.loss.filter(l => l.year >= startYear && l.year <= endYear),
          'area_loss'
        ) || 0;
      const locationExtent = extent.filter(l => l.id === d.id);
      const percentage = loss / locationExtent[0].extent * 100;
      return {
        label: (region && region.label) || '',
        loss,
        percentage,
        value: settings.unit === 'ha' ? loss : percentage,
        path: `/country/${location.country}/${
          location.region ? `${location.region}/` : ''
        }${d.id}`
      };
    });

    return sortByKey(mappedData, 'loss');
  }
);

export const parseData = createSelector(
  [mapData, getColors],
  (data, colors) => {
    if (!data) return null;
    const sortedData = sortByKey(uniqBy(data, 'label'), 'value', true);

    return sortedData.map(o => ({
      ...o,
      color: colors.main
    }));
  }
);

export const getSentence = createSelector(
  [
    mapData,
    parseData,
    getSettings,
    getOptions,
    getLocation,
    getActiveIndicator,
    getLocationNames,
    getSentences
  ],

  (
    data,
    sortedData,
    settings,
    options,
    location,
    indicator,
    locationNames,
    sentences
  ) => {
    if (!data || !options || !indicator || !locationNames) return '';
    const {
      initial,
      withIndicator,
      initialPercent,
      withIndicatorPercent
    } = sentences;
    const { startYear, endYear } = settings;
    const totalLoss = sumBy(data, 'loss');
    const currentLocation =
      locationNames && locationNames.current && locationNames.current.label;
    const topRegion = sortedData.length && sortedData[0];
    const avgLossPercentage = sumBy(data, 'percentage') / data.length;
    const avgLoss = sumBy(data, 'loss') / data.length;
    let percentileLoss = 0;
    let percentileLength = 0;

    while (
      (percentileLength < data.length && percentileLoss / totalLoss < 0.5) ||
      (percentileLength < 10 && data.length > 10)
    ) {
      percentileLoss += data[percentileLength].loss;
      percentileLength += 1;
    }
    const topLoss = percentileLoss / totalLoss * 100;
    let sentence =
      indicator.value === 'gadm28' ? initialPercent : withIndicatorPercent;
    if (settings.unit !== '%') {
      sentence = indicator.value === 'gadm28' ? initial : withIndicator;
    }

    const params = {
      indicator: indicator.value,
      location: currentLocation,
      startYear,
      endYear,
      topLoss: `${format('.0f')(topLoss)}%`,
      percentileLength,
      region: percentileLength > 1 ? topRegion.label : 'This region',
      value:
        topRegion.percentage > 1 && settings.unit === '%'
          ? `${format('.0f')(topRegion.percentage)}%`
          : `${format('.3s')(topRegion.loss)}ha`,
      average:
        topRegion.percentage > 1 && settings.unit === '%'
          ? `${format('.0f')(avgLossPercentage)}%`
          : `${format('.3s')(avgLoss)}ha`
    };

    return {
      sentence,
      params
    };
  }
);
