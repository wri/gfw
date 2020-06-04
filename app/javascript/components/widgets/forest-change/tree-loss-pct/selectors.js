import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { formatNumber } from 'utils/format';
import {
  yearTicksFormatter,
  zeroFillYears
} from 'components/widgets/utils/data';

// get list data
const getLoss = state => state.data && state.data.loss;
const getExtent = state => state.data && state.data.extent;
const getPrimaryLoss = state => state.data && state.data.primaryLoss;
const getAdminLoss = state => state.data && state.data.adminLoss;
const getSettings = state => state.settings;
const getLocationLabel = state => state.locationLabel;
const getIndicator = state => state.indicator;
const getColors = state => state.colors;
const getSentence = state => state && state.sentence;
const getTitle = state => state.title;

const parseData = createSelector(
  [getAdminLoss, getPrimaryLoss, getLoss, getExtent, getSettings],
  (adminLoss, primaryLoss, allLoss, extent, settings) => {
    if (
      !extent ||
      !adminLoss ||
      isEmpty(adminLoss) ||
      !primaryLoss ||
      isEmpty(primaryLoss) ||
      isEmpty(allLoss) ||
      !allLoss
    ) {
      return null;
    }
    const { startYear, endYear, yearsRange } = settings;
    const years = yearsRange && yearsRange.map(yearObj => yearObj.value);
    const fillObj = {
      area: 0,
      biomassLoss: 0,
      bound1: null,
      emissions: 0,
      percentage: 0
    };
    const initalLossArr = primaryLoss.find(d => d.year === 2002);
    const initalLoss = initalLossArr
      ? initalLossArr.umd_tree_cover_loss__ha
      : 0;
    const totalAdminLoss =
      sumBy(
        adminLoss.filter(d => d.year >= startYear && d.year <= endYear),
        'area'
      ) || 0;

    let initalExtent = extent - initalLoss || 0;
    const initalExtent2001 = extent - initalLoss || 0;

    const zeroFilledData = zeroFillYears(
      primaryLoss,
      2001,
      endYear,
      [2001, ...years],
      fillObj
    );

    const parsedData = zeroFilledData.map(d => {
      if (d.year !== 2001) initalExtent -= d.area;
      const yearData = {
        ...d,
        initalExtent2001,
        totalLoss: totalAdminLoss,
        area: d.area || 0,
        emissions: d.emissions || 0,
        extentRemainingHa: initalExtent,
        extentRemaining: 100 * initalExtent / initalExtent2001
      };
      return yearData;
    });
    return parsedData;
  }
);

const filterData = createSelector(
  [parseData, getSettings],
  (parsedData, settings) => {
    if (!parsedData || isEmpty(parsedData)) {
      return null;
    }
    const { startYear, endYear } = settings;
    return parsedData.filter(d => d.year >= startYear && d.year <= endYear);
  }
);

const parseConfig = createSelector([getColors], colors => ({
  height: 250,
  xKey: 'year',
  yKeys: {
    bars: {
      area: {
        fill: colors.primaryForestLoss,
        background: false,
        yAxisId: 'area'
      }
    },
    lines: {
      extentRemaining: {
        stroke: colors.primaryForestExtent,
        yAxisId: 'extentRemaining',
        strokeDasharray: '3 4'
      }
    }
  },
  xAxis: {
    tickFormatter: yearTicksFormatter
  },
  yAxis: {
    yAxisId: 'area'
  },
  rightYAxis: {
    yAxisId: 'extentRemaining',
    unit: '%',
    maxYValue: 100
  },
  unit: 'ha',
  tooltip: [
    {
      key: 'year'
    },
    {
      key: 'extentRemaining',
      unitFormat: value =>
        formatNumber({ num: value, unit: '%', precision: 3 }),
      label: 'Primary forest extent remaining',
      color: colors.primaryForestExtent,
      dashline: true
    },
    {
      key: 'area',
      unitFormat: value => formatNumber({ num: value, unit: 'ha' }),
      label: 'Primary forest loss',
      color: colors.primaryForestLoss
    }
  ]
}));

export const parseTitle = createSelector(
  [getTitle, getLocationLabel],
  (title, name) => {
    let selectedTitle = title.default;
    if (name === 'global') {
      selectedTitle = title.global;
    }
    return selectedTitle;
  }
);

const parseSentence = createSelector(
  [
    parseData,
    getExtent,
    getSettings,
    getLocationLabel,
    getIndicator,
    getSentence
  ],
  (data, extent, settings, locationLabel, indicator, sentences) => {
    if (!data) return null;
    const {
      initial,
      withIndicator,
      noLoss,
      noLossWithIndicator,
      globalInitial,
      globalWithIndicator
    } = sentences;
    const { startYear, endYear } = settings;
    const totalLossPrimary = (data && data.length && sumBy(data, 'area')) || 0;
    const totalLoss = (data && data.length && data[0].totalLoss) || 0;
    const percentageLoss =
      (totalLoss && extent && totalLossPrimary / totalLoss * 100) || 0;

    const initialExtentData = data.find(d => d.year === startYear - 1);
    const initialExtent =
      (initialExtentData && initialExtentData.extentRemaining) || 0;

    const finalExtentData = data.find(d => d.year === endYear);
    const finalExtent =
      (finalExtentData && finalExtentData.extentRemaining) || 0;

    let sentence = indicator ? withIndicator : initial;
    if (totalLoss === 0) {
      sentence = indicator ? noLossWithIndicator : noLoss;
    }
    if (locationLabel === 'global') {
      sentence = indicator ? globalWithIndicator : globalInitial;
    }
    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel === 'global' ? 'globally' : locationLabel,
      startYear,
      endYear,
      extentDelta: formatNumber({
        num: Math.abs(initialExtent - finalExtent),
        unit: '%'
      }),
      loss: formatNumber({ num: totalLossPrimary, unit: 'ha' }),
      percent: formatNumber({ num: percentageLoss, unit: '%' }),
      component: {
        key: 'total tree cover loss',
        fine: true,
        tooltip:
          'Total tree cover loss includes loss in dry and non-tropical primary forests, secondary forests, and tree plantations in addition to humid primary forest loss.'
      }
    };

    return {
      sentence,
      params
    };
  }
);

export default createStructuredSelector({
  data: filterData,
  config: parseConfig,
  sentence: parseSentence,
  title: parseTitle
});
