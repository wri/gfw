import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import groupBy from 'lodash/groupBy';
import maxBy from 'lodash/maxBy';
import { format } from 'd3-format';
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

const sumByYear = (data) => {
  const groupedByYear = groupBy(data, 'year');
  const summedByYear = Object.entries(groupedByYear);

  return summedByYear.map(([yearKey, valArr]) => ({
    areaLoss: sumBy(valArr, 'areaLoss'),
    areaLossFires: sumBy(valArr, 'areaLossFires'),
    umd_tree_cover_loss__ha: sumBy(valArr, 'umd_tree_cover_loss__ha'),
    umd_tree_cover_loss__year: sumBy(valArr, 'umd_tree_cover_loss__year'),
    umd_tree_cover_loss_from_fires__ha: sumBy(valArr, 'umd_tree_cover_loss_from_fires__ha'),
    year: parseInt(yearKey, 10),
  }));
};

const parseData = createSelector([getLoss, getSettings], (lossData, settings) => {
  if (!lossData || isEmpty(lossData)) return null;
  const { startYear, endYear } = settings;

  const loss = sumByYear(lossData);

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
      };
    });
});

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
        fill: colors.main,
        background: false,
        stackId: 1,
      },
      treeCoverLossNotFires: {
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
      unitFormat: (value) => formatNumber({ num: value, unit: 'ha' }),
      label: 'Tree cover loss',
      color: colors.treeCoverLoss,
    },
    {
      key: 'umd_tree_cover_loss_from_fires__ha',
      label: 'Tree cover loss from fires',
      unitFormat: (value) => formatNumber({ num: value, unit: 'ha' }),
      color: colors.main,
    },
  ],
}));

const parseSentence = createSelector(
  [zeroFillData, getSettings, getLocationLabel, getIndicator, getSentence],
  (data, settings, locationLabel, indicator, sentences) => {
    if (!data) return null;
    const { globalInitial, globalWithIndicator, initial, withIndicator, noLoss, noLossWithIndicator } = sentences;
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
      treeCoverLossFires: formatNumber({ num: treeCoverLossFires, unit: 'ha' }),
      treeCoverLossNotFires: formatNumber({
        num: treeCoverLossNotFires,
        unit: 'ha',
      }),
      highestYearFires: highestYearFires.year,
      highestYearFiresLossFires: formatNumber({
        num: highestYearFires.treeCoverLossFires,
        unit: 'ha',
      }),
      highestYearFiresPercentageLossFires: `${format('.2r')(
        highestYearFiresPercentageLossFires
      )}%`,
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

export default createStructuredSelector({
  data: zeroFillData,
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle,
});
