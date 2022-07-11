import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import maxBy from 'lodash/maxBy';
import { format } from 'd3-format';
import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
  zeroFillYears,
} from 'components/widgets/utils/data';

// get list data
const getLoss = (state) => state.data && state.data.loss;
// const getExtent = (state) => state.data && state.data.extent;
const getSettings = (state) => state.settings;
// const getIsTropical = (state) => state.isTropical;
const getLocationLabel = (state) => state.locationLabel;
// const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentence = (state) => state && state.sentence;

const parseData = createSelector(
  [
    getLoss,
    // getExtent,
    getSettings,
  ],
  (
    data,
    // extentData,
    settings
  ) => {
    // if (!data || isEmpty(data) || !extentData) return null;
    if (!data || isEmpty(data)) return null;
    const { startYear, endYear } = settings;

    // const extent = (extentData.length && extentData[0]?.extent) || 0;

    return data
      .filter((d) => d.year >= startYear && d.year <= endYear)
      .map((d) => {
        // const percentageLoss =
        //   (d.area && d.area && (d.area / extent) * 100) || 0;

        return {
          ...d,
          area: d.area || 0,
          emissions: d.emissions || 0,
          // percentage: percentageLoss > 100 ? 100 : percentageLoss,
          treeCoverLossFires: d.umd_tree_cover_loss_from_fires__ha,
          treeCoverLossNotFires:
            d.umd_tree_cover_loss__ha - d.umd_tree_cover_loss_from_fires__ha,
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
      // percentage: 0,
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
  [
    zeroFillData,
    // getExtent,
    getSettings,
    // getIsTropical,
    getLocationLabel,
    // getIndicator,
    getSentence,
  ],
  (
    data,
    // extentData,
    settings,
    // tropical,
    locationLabel,
    // indicator,
    sentences
  ) => {
    if (!data) return null;
    const {
      initial,
      // withIndicator,
      noLoss,
      // noLossWithIndicator,
    } = sentences;
    const {
      startYear,
      endYear,
      // extentYear,
    } = settings;
    // const extent = (extentData.length && extentData[0]?.extent) || 0;
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
    // const totalEmissions =
    //   (data && data.length && sumBy(data, 'emissions')) || 0;
    // const percentageLoss =
    //   (totalLoss && extent && (totalLoss / extent) * 100) || 0;
    // let sentence = indicator ? withIndicator : initial;
    let sentence = initial;
    if (treeCoverLossFires === 0) {
      sentence = noLoss;
    }
    // sentence = `${sentence}.`;

    const params = {
      // indicator: indicator && indicator.label,
      location: locationLabel,
      startYear,
      endYear,
      // loss: formatNumber({ num: totalLoss, unit: 'ha' }),
      // treeCoverLoss: formatNumber({ num: totalLoss, unit: 'ha' }),
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
      // percent: `${format('.2r')(percentageLoss)}%`,
      // emissions: `${format('.3s')(totalEmissions)}t`,
      // extentYear,
    };

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: zeroFillData,
  config: parseConfig,
  sentence: parseSentence,
});
