import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
  zeroFillYears,
} from 'components/widgets/utils/data';

// get list data
const getLoss = (state) => state.data && state.data.loss;
const getTitle = (state) => state.title;
const getSettings = (state) => state.settings;
const getLocationLabel = (state) => state.locationLabel;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentence = (state) => state && state.sentence;
const getChartDecorationConfig = (state) => state.chartDecorationConfig;
const getAlerts = (state) => state.alerts || [];
const getAdm0 = (state) => state.adm0;

const sumByYear = (data) => {
  const groupedByYear = groupBy(data, 'year');
  const summedByYear = Object.entries(groupedByYear);

  return summedByYear.map(([yearKey, valArr]) => ({
    areaLoss: sumBy(valArr, 'areaLoss'),
    areaLossFires: sumBy(valArr, 'areaLossFires'),
    umd_tree_cover_loss__ha: sumBy(valArr, 'umd_tree_cover_loss__ha'),
    umd_tree_cover_loss__year: sumBy(valArr, 'umd_tree_cover_loss__year'),
    umd_tree_cover_loss_from_fires__ha: sumBy(
      valArr,
      'umd_tree_cover_loss_from_fires__ha'
    ),
    year: parseInt(yearKey, 10),
  }));
};

const parseData = createSelector(
  [getLoss, getSettings, getChartDecorationConfig, getLocationLabel],
  (lossData, settings, chartDecorationConfig, locationLabel) => {
    if (!lossData || isEmpty(lossData)) return null;
    const { startYear, endYear } = settings;

    const loss = sumByYear(lossData);

    const showDecoration = (thisYear) => {
      const { years: yearsConfig, locations, type } = chartDecorationConfig;
      if (yearsConfig.includes(thisYear) && locations.includes(locationLabel)) {
        return type;
      }
      return null;
    };

    return loss
      .filter((d) => d.year >= startYear && d.year <= endYear)
      .map((d) => {
        return {
          ...d,
          area: d.area || 0,
          emissions: d.emissions || 0,
          treeCoverLossFires: d.umd_tree_cover_loss_from_fires__ha,
          treeCoverLossNotFires:
            d.umd_tree_cover_loss__ha - d.umd_tree_cover_loss_from_fires__ha,
          decoration: showDecoration(d.year),
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
      // umd_tree_cover_loss__ha: 0,
    };
    return zeroFillYears(data, startYear, endYear, years, fillObj);
  }
);

const parseConfig = createSelector([getColors], (colors) => ({
  height: 250,
  xKey: 'year',
  yKeys: {
    bars: {
      treeCoverLossFires: {
        isAnimationActive: false,
        fill: colors.main,
        background: false,
        stackId: 1,
      },
      treeCoverLossNotFires: {
        isAnimationActive: false,
        fill: colors.treeCoverLoss,
        background: false,
        stackId: 1,
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
      key: 'umd_tree_cover_loss__ha',
      unitFormat: (value) =>
        formatNumber({ num: value, unit: 'ha', spaceUnit: true }),
      label: 'Tree cover loss',
      color: colors.treeCoverLoss,
    },
    {
      key: 'umd_tree_cover_loss_from_fires__ha',
      label: 'Tree cover loss from fires',
      unitFormat: (value) =>
        formatNumber({
          num: value,
          unit: 'ha',
          spaceUnit: true,
        }),
      color: colors.main,
    },
  ],
}));

const parseSentence = createSelector(
  [zeroFillData, getSettings, getLocationLabel, getIndicator, getSentence],
  (data, settings, locationLabel, indicator, sentences) => {
    if (!data) return null;
    const {
      globalInitial,
      globalWithIndicator,
      initial,
      withIndicator,
      noLoss,
      noLossWithIndicator,
    } = sentences;
    const { startYear, endYear } = settings;
    const totalLoss =
      (data && data.length && sumBy(data, 'umd_tree_cover_loss__ha')) || 0;
    const treeCoverLossFires =
      (data &&
        data.length &&
        sumBy(data, 'umd_tree_cover_loss_from_fires__ha')) ||
      0;
    const treeCoverLossNotFires = totalLoss - treeCoverLossFires;
    const highestYearFires =
      (data &&
        data.length &&
        maxBy(data, 'umd_tree_cover_loss_from_fires__ha')) ||
      0;
    const highestYearFiresPercentageLossFires =
      (totalLoss &&
        (highestYearFires.umd_tree_cover_loss_from_fires__ha * 100) /
          highestYearFires.umd_tree_cover_loss__ha) ||
      0;
    let sentence = indicator ? withIndicator : initial;
    if (treeCoverLossFires === 0) {
      sentence = indicator ? noLossWithIndicator : noLoss;
    }
    if (locationLabel === 'global') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }

    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      startYear,
      endYear,
      treeCoverLossFires: formatNumber({
        num: treeCoverLossFires,
        unit: 'ha',
        spaceUnit: true,
      }),
      treeCoverLossNotFires: formatNumber({
        num: treeCoverLossNotFires,
        unit: 'ha',
        spaceUnit: true,
      }),
      highestYearFires: highestYearFires.year,
      highestYearFiresLossFires: formatNumber({
        num: highestYearFires.treeCoverLossFires,
        unit: 'ha',
        spaceUnit: true,
      }),
      highestYearFiresPercentageLossFires: formatNumber({
        num: highestYearFiresPercentageLossFires,
        unit: '%',
      }),
    };

    return {
      sentence,
      params,
    };
  }
);

export const parseTitle = createSelector(
  [getTitle, getLocationLabel],
  (title, name) => {
    return name === 'global' ? title.global : title.default;
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
  title: parseTitle,
  alerts: parseAlerts,
});
