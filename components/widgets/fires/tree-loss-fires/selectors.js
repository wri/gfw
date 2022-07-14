import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';
import { format } from 'd3-format';

// get list data
const getLoss = (state) => state.data && state.data.lossFires;
const getSettings = (state) => state.settings;
const getIndicator = (state) => state.indicator;
const getLocationsMeta = (state) => state.childData;
const getLocationName = (state) => state.locationLabel;
const getLocation = (state) => state.location;
const getColors = (state) => state.colors;
const getSentences = (state) => state.sentences;
const getTitle = (state) => state.title;

export const mapData = createSelector(
  [getLoss, getSettings, getLocationsMeta],
  (data, settings, meta) => {
    if (isEmpty(data) || isEmpty(meta)) return null;
    const { startYear, endYear } = settings;

    const mappedData = data.map((d) => {
      const region = meta[d.id];

      const loss =
        sumBy(
          d.loss.filter((l) => l.year >= startYear && l.year <= endYear),
          'areaLossFires'
        ) || 0;
      const lossInTotal =
        sumBy(
          d.loss.filter((l) => l.year >= startYear && l.year <= endYear),
          'areaLoss'
        ) || 0;
      const numberOfYears = d.loss.filter(
        (l) => l.year >= startYear && l.year <= endYear
      ).length;
      const percentage = loss && lossInTotal ? (loss * 100) / lossInTotal : 0;
      const normalPercentage = percentage > 100 ? 100 : percentage;

      return {
        label: (region && region.label) || '',
        loss,
        path: (region && region.path) || '',
        percentage: normalPercentage,
        value: settings.unit === 'ha' ? loss / numberOfYears : normalPercentage,
        numberOfYears,
      };
    });

    return sortBy(mappedData, 'loss');
  }
);

export const parseData = createSelector(
  [mapData, getColors],
  (data, colors) => {
    if (!data) return null;
    const sortedData = sortBy(uniqBy(data, 'label'), 'value').reverse();

    return sortedData.map((o) => ({
      ...o,
      color: colors.main,
    }));
  }
);

export const parseSentence = createSelector(
  [parseData, getSettings, getIndicator, getLocation, getSentences],
  (data, settings, indicator, location, sentences) => {
    if (!data || !data.length || !location) return null;
    const { startYear, endYear } = settings;
    const {
      initial,
      initialPercent,
      withIndicator,
      withIndicatorPercent,
    } = sentences;
    const locationData = location && data.find((l) => l.id === location.value);

    const loss = locationData && locationData.loss;
    const globalLoss = sumBy(data, 'loss') || 0;
    const globalExtent = sumBy(data, 'extent') || 0;
    const lossArea = location.label === 'global' ? globalLoss : loss;
    const areaPercent =
      location.label === 'global'
        ? (100 * globalLoss) / globalExtent
        : (locationData && format('.1f')(locationData.percentage)) || 0;
    const lossPercent = loss && locationData ? (100 * loss) / globalLoss : 0;

    const indicatorName = !indicator ? 'region-wide' : `${indicator.label}`;
    let sentence = !indicator ? initialPercent : withIndicatorPercent;
    if (settings.unit !== '%') {
      sentence = !indicator ? initial : withIndicator;
    }

    const topRegionData = data[0];

    const params = {
      indicator: indicatorName,
      topLocationLabel: topRegionData && topRegionData.label,
      topLocationPerc:
        topRegionData &&
        formatNumber({ num: topRegionData.percentage, unit: '%' }),
      topLocationLoss:
        topRegionData && formatNumber({ num: topRegionData.loss, unit: 'ha' }),
      topLocationLossAverage:
        topRegionData &&
        formatNumber({
          num: topRegionData.loss / topRegionData.numberOfYears,
          unit: 'ha',
        }),
      location:
        location.label === 'global' ? 'globally' : location && location.label,
      indicator_alt: indicatorName,
      startYear,
      endYear,
      loss: formatNumber({ num: lossArea, unit: 'ha' }),
      localPercent: formatNumber({ num: areaPercent, unit: '%' }),
      globalPercent: formatNumber({ num: lossPercent, unit: '%' }),
      extentYear: settings.extentYear,
    };

    return {
      sentence,
      params,
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
  title: parseTitle,
});
