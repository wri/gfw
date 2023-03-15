import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';

// get list data
const getDensity = (state) => state.data && state.data;
const getLocationLabel = (state) => state.locationLabel;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentence = (state) => state && state.sentence;

const parseData = createSelector([getDensity], (densityData) => {
  if (!densityData) {
    return null;
  }

  return densityData.map((dataItem) => {
    return {
      area: dataItem.wri_tropical_tree_cover_extent__ha,
      decile: dataItem.wri_tropical_tree_cover__decile,
    };
  });
});

const parseConfig = createSelector([getColors], (colors) => ({
  height: 250,
  xKey: 'decile',
  yKeys: {
    bars: {
      area: {
        fill: colors.treeCoverDensity,
        background: false,
        yAxisId: 'wri_tropical_tree_cover_extent__ha',
      },
    },
  },
  xAxis: {
    tickFormatter: (value) => `${value}-${value + 9}`,
  },
  yAxis: {
    yAxisId: 'wri_tropical_tree_cover_extent__ha',
  },
  unit: 'ha',
  tooltip: [
    {
      key: 'area',
      unitFormat: (value) => formatNumber({ num: value, unit: 'ha' }),
      label: 'Land cover',
      color: colors.primaryForestLoss,
      dashline: true,
    },
  ],
}));

const parseSentence = createSelector(
  [parseData, getLocationLabel, getIndicator, getSentence],
  (data, locationLabel, indicator, sentences) => {
    if (!data) return null;

    const areasSummed = data.reduce((acc, curr) => acc + curr.area, 0);
    const areaOverTenPercentSummed = data
      .filter((item) => item.decile > 0)
      .reduce((acc, curr) => acc + curr.area, 0);
    const areaOverTenPercentByTotalArea =
      areaOverTenPercentSummed / areasSummed;
    const { initial, withIndicator } = sentences;
    const sentence = indicator ? withIndicator : initial;
    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      percent: formatNumber({ num: 10, unit: '%' }),
      areaOverTenPercent: formatNumber({
        num: areaOverTenPercentSummed,
        unit: 'ha',
      }),
      area: formatNumber({ num: areaOverTenPercentByTotalArea, unit: 'ha' }),
    };

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  sentence: parseSentence,
});
