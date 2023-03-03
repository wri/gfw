import { createSelector, createStructuredSelector } from 'reselect';
import { formatNumber } from 'utils/format';
import { yearTicksFormatter } from 'components/widgets/utils/data';

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
    tickFormatter: yearTicksFormatter,
  },
  yAxis: {
    yAxisId: 'wri_tropical_tree_cover_extent__ha',
  },
  unit: 'ha',
  tooltip: [
    {
      key: 'decile',
      unitFormat: (value) =>
        formatNumber({ num: value, unit: '%', precision: 3 }),
      label: 'Tree cover density decile',
      color: colors.primaryForestExtent,
    },
    {
      key: 'area',
      unitFormat: (value) => formatNumber({ num: value, unit: 'ha' }),
      label: 'Tree cover density area',
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
    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      percent: formatNumber({ num: data[9].decile, unit: '%' }),
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
