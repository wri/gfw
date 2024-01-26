import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
  zeroFillYears,
} from 'components/widgets/utils/data';

// get list data
const getLoss = (state) => state.data && state.data.loss;
const getExtent = (state) => state.data && state.data.extent;
const getSettings = (state) => state.settings;
const getIsTropical = (state) => state.isTropical;
const getLocationLabel = (state) => state.locationLabel;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentence = (state) => state && state.sentence;
const getAlerts = (state) => state.alerts || [];
const getAdm0 = (state) => state.adm0;

const parseData = createSelector(
  [getLoss, getExtent, getSettings],
  (data, extentData, settings) => {
    if (!data || isEmpty(data) || !extentData) return null;
    const { startYear, endYear } = settings;

    const extent = Array.isArray(extentData)
      ? extentData[0]?.extent || 0
      : (!isNaN(extentData) && extentData) || 0;

    return data
      .filter((d) => d.year >= startYear && d.year <= endYear)
      .map((d) => {
        const percentageLoss =
          (d.area && d.area && (d.area / extent) * 100) || 0;

        return {
          ...d,
          area: d.area || 0,
          emissions: d.emissions || 0,
          percentage: percentageLoss > 100 ? 100 : percentageLoss,
        };
      });
  }
);

const zeroFillData = createSelector(
  [parseData, getSettings],
  (data, settings) => {
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear, yearsRange } = settings;
    const years = yearsRange && yearsRange.map((yearObj) => yearObj.value);
    const fillObj = {
      area: 0,
      bound1: null,
      emissions: 0,
      percentage: 0,
    };
    return zeroFillYears(data, startYear, endYear, years, fillObj);
  }
);

const parseConfig = createSelector([getColors], (colors) => ({
  height: 250,
  xKey: 'year',
  yKeys: {
    bars: {
      area: {
        fill: colors.main,
        background: false,
      },
    },
  },
  xAxis: {
    tickFormatter: yearTicksFormatter,
  },
  unit: 'ha',
  tooltip: [
    {
      key: 'year',
    },
    {
      key: 'area',
      label: 'Tree cover loss',
      unitFormat: (value) =>
        formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      color: colors.main,
    },
    {
      key: 'percentage',
      unitFormat: (value) => formatNumber({ num: value, unit: '%' }),
      label: 'Percentage of tree cover',
      color: 'transparent',
    },
  ],
}));

const parseSentence = createSelector(
  [
    zeroFillData,
    getExtent,
    getSettings,
    getIsTropical,
    getLocationLabel,
    getIndicator,
    getSentence,
  ],
  (
    data,
    extentData,
    settings,
    tropical,
    locationLabel,
    indicator,
    sentences
  ) => {
    if (!data) return null;
    const {
      initial,
      withIndicator,
      noLoss,
      noLossWithIndicator,
      co2Emissions,
    } = sentences;
    const { startYear, endYear, extentYear } = settings;
    const extent = Array.isArray(extentData)
      ? extentData[0]?.extent || 0
      : (!isNaN(extentData) && extentData) || 0;
    const totalLoss = (data && data.length && sumBy(data, 'area')) || 0;
    const totalEmissions =
      (data && data.length && sumBy(data, 'emissions')) || 0;
    const percentageLoss =
      (totalLoss && extent && (totalLoss / extent) * 100) || 0;
    let sentence = indicator ? withIndicator : initial;
    if (totalLoss === 0) {
      sentence = indicator ? noLossWithIndicator : noLoss;
    }
    if (tropical && totalLoss > 0) {
      sentence = `${sentence}, ${co2Emissions}`;
    }
    sentence = `${sentence}.`;

    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      startYear,
      endYear,
      loss: formatNumber({ num: totalLoss, unit: 'ha', spaceUnit: true }),
      percent: formatNumber({ num: percentageLoss, unit: '%' }),
      emissions: formatNumber({
        num: totalEmissions,
        unit: 't',
        spaceUnit: true,
      }),
      extentYear,
    };

    return {
      sentence,
      params,
    };
  }
);

export const parseAlerts = createSelector(
  [getAlerts, getLocationLabel, getAdm0],
  (alerts, locationLabel, adm0) => {
    const countriesWithNewWarningText = [
      'CMR',
      'CIV',
      'COD',
      'GNQ',
      'GAB',
      'GHA',
      'GIN',
      'GNB',
      'LBR',
      'MDG',
      'COG',
      'SLE',
    ];

    if (countriesWithNewWarningText.includes(adm0)) {
      return [
        {
          text: `The methods behind this data have changed over time, resulting in an underreporting of tree cover loss in ${locationLabel} prior to 2015. We advise against comparing the data before/after 2015 in ${locationLabel}. [Read more here](https://www.globalforestwatch.org/blog/data-and-research/tree-cover-loss-satellite-data-trend-analysis/).`,
          visible: ['global', 'country', 'geostore', 'aoi', 'wdpa', 'use'],
        },
      ];
    }

    return alerts;
  }
);

export default createStructuredSelector({
  data: zeroFillData,
  config: parseConfig,
  sentence: parseSentence,
  alerts: parseAlerts,
});
