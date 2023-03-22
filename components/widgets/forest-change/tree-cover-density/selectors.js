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

const formatXaxis = (value) => {
  if (value >= 90) {
    return `${value}-${value + 10}`;
  }

  return `${value}-${value + 9}`;
};

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
    tickFormatter: formatXaxis,
    label: 'Tree cover (%)',
  },
  yAxis: {
    yAxisId: 'wri_tropical_tree_cover_extent__ha',
    label: 'Land cover (in hectares)',
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
    const { initial, withIndicator } = sentences;
    const sentence = indicator ? withIndicator : initial;

    const totalArea = data.reduce((acc, curr) => acc + curr.area, 0);
    const areasOverTenPercent = data
      .filter((item) => item.decile > 0)
      .reduce((acc, curr) => acc + curr.area, 0);
    const areasOverTenPercentByTotalArea = (
      (areasOverTenPercent / totalArea) *
      100
    ).toFixed(1);

    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      percent: formatNumber({ num: 10, unit: '%' }),
      areasOverTenPercent: formatNumber({
        num: areasOverTenPercent,
        unit: 'ha',
      }),
      areaInPercent: `${areasOverTenPercentByTotalArea}%`,
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