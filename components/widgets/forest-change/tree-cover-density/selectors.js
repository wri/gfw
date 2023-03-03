import { createSelector, createStructuredSelector } from 'reselect';
import { yearTicksFormatter } from 'components/widgets/utils/data';

// get list data
const getDensity = (state) => state.data && state.data;
// const getLocationLabel = (state) => state.locationLabel;
// const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
// const getSentence = (state) => state && state.sentence;

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
        fill: colors.primaryForestLoss,
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
  // tooltip: [
  //   {
  //     key: 'year',
  //   },
  //   {
  //     key: 'extentRemaining',
  //     unitFormat: (value) =>
  //       formatNumber({ num: value, unit: '%', precision: 3 }),
  //     label: 'Primary forest extent remaining',
  //     color: colors.primaryForestExtent,
  //     dashline: true,
  //   },
  //   {
  //     key: 'area',
  //     unitFormat: (value) => formatNumber({ num: value, unit: 'ha' }),
  //     label: 'Primary forest loss',
  //     color: colors.primaryForestLoss,
  //   },
  // ],
}));

// const parseSentence = createSelector(
//   [
//     parseData,

//     getExtent,
//     getSettings,
//     getLocationLabel,
//     getIndicator,
//     getSentence,
//   ],
//   (
//     data,
//     filteredData,
//     extent,
//     settings,
//     locationLabel,
//     indicator,
//     sentences
//   ) => {
//     if (!data) return null;
//     const {
//       initial,
//       withIndicator,
//       noLoss,
//       noLossWithIndicator,
//       globalInitial,
//       globalWithIndicator,
//     } = sentences;
//     const { startYear, endYear } = settings;

//     const totalLossPrimary =
//       filteredData && filteredData.length ? sumBy(filteredData, 'area') : 0;

//     const totalLoss = data && data.length ? data[0].totalLoss : 0;
//     const percentageLoss =
//       (totalLoss && extent && (totalLossPrimary / totalLoss) * 100) || 0;

//     const initialExtentData = data.find((d) => d.year === startYear - 1);
//     const initialExtent =
//       (initialExtentData && initialExtentData.extentRemaining) || 100;

//     const finalExtentData = data.find((d) => d.year === endYear);
//     const finalExtent =
//       (finalExtentData && finalExtentData.extentRemaining) || 0;

//     let sentence = indicator ? withIndicator : initial;
//     if (totalLoss === 0) {
//       sentence = indicator ? noLossWithIndicator : noLoss;
//     }
//     if (locationLabel === 'global') {
//       sentence = indicator ? globalWithIndicator : globalInitial;
//     }
//     const params = {
//       indicator: indicator && indicator.label,
//       location: locationLabel === 'global' ? 'globally' : locationLabel,
//       startYear,
//       endYear,
//       extentDelta: formatNumber({
//         num: Math.abs(initialExtent - finalExtent),
//         unit: '%',
//       }),
//       loss: formatNumber({ num: totalLossPrimary, unit: 'ha' }),
//       percent: formatNumber({ num: percentageLoss, unit: '%' }),
//       component: {
//         key: 'total tree cover loss',
//         fine: true,
//         tooltip:
//           'Total tree cover loss includes loss in dry and non-tropical primary forests, secondary forests, and tree plantations in addition to humid primary forest loss.',
//       },
//     };

//     return {
//       sentence,
//       params,
//     };
//   }
// );

export default createStructuredSelector({
  data: parseData,
  config: parseConfig,
  // sentence: parseSentence,
  // title: parseTitle,
});
