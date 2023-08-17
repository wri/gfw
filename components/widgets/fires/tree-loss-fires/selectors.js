import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import sumBy from 'lodash/sumBy';
import sortBy from 'lodash/sortBy';
import { formatNumber } from 'utils/format';

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

      const valueHa = loss > 0 ? loss / numberOfYears : 0;

      return {
        label: (region && region.label) || '',
        loss,
        path: (region && region.path) || '',
        percentage: normalPercentage,
        value: settings.unit === 'ha' ? valueHa : normalPercentage,
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
        topRegionData &&
        formatNumber({ num: topRegionData.loss, unit: 'ha', spaceUnit: true }),
      topLocationLossAverage:
        topRegionData &&
        formatNumber({
          num:
            topRegionData.loss > 0
              ? topRegionData.loss / topRegionData.numberOfYears
              : 0,
          unit: 'ha',
          spaceUnit: true,
        }),
      location:
        location.label === 'global' ? 'globally' : location && location.label,
      indicator_alt: indicatorName,
      startYear,
      endYear,
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
