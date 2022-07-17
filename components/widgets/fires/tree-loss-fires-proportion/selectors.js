import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';

// get list data
const getLoss = (state) => state.data && state.data.loss;
const getSettings = (state) => state.settings;
const getLocationLabel = (state) => state.locationLabel;
const getIndicator = (state) => state.indicator;
const getColors = (state) => state.colors;
const getSentence = (state) => state && state.sentence;

const parseData = createSelector([getLoss, getSettings], (data, settings) => {
  if (!data || isEmpty(data)) return null;
  const { startYear, endYear } = settings;

  const parsedData = data
    .filter((d) => d.year >= startYear && d.year <= endYear)
    .map((d) => {
      return {
        ...d,
        treeCoverLoss: d.umd_tree_cover_loss__ha,
        treeCoverLossFires: d.umd_tree_cover_loss_from_fires__ha,
        treeCoverLossNotFires:
          d.umd_tree_cover_loss__ha - d.umd_tree_cover_loss_from_fires__ha,
      };
    });

  return {
    treeCoverLoss: sumBy(parsedData, 'treeCoverLoss'),
    treeCoverLossFires: sumBy(parsedData, 'treeCoverLossFires'),
    treeCoverLossNotFires: sumBy(parsedData, 'treeCoverLossNotFires'),
  };
});

const transformData = createSelector([parseData, getColors], (data, colors) => {
  if (!data || isEmpty(data)) return null;

  const pieContent = [
    {
      label: 'Tree cover loss from other sources',
      property: 'treeCoverLossNotFires',
      color: colors.treeCoverLoss,
    },
    {
      label: 'Tree cover loss from fires',
      property: 'treeCoverLossFires',
      color: colors.main,
    },
  ];

  return pieContent.map((item) => {
    const value = data[item.property];
    const percentage = (100 * value) / data.totalTreeCoverLoss;

    return {
      ...item,
      value,
      percentage,
    };
  });
});

const parseSentence = createSelector(
  [parseData, getSettings, getLocationLabel, getIndicator, getSentence],
  (data, settings, locationLabel, indicator, sentences) => {
    if (!data) return null;
    const { initial, withIndicator, noLoss, noLossWithIndicator } = sentences;
    const { startYear, endYear } = settings;
    const { treeCoverLoss, treeCoverLossFires } = data;

    const lossFiresPercentage = (treeCoverLossFires * 100) / treeCoverLoss;
    let sentence = indicator ? withIndicator : initial;
    if (treeCoverLossFires === 0) {
      sentence = indicator ? noLossWithIndicator : noLoss;
    }

    const params = {
      indicator: indicator && indicator.label,
      location: locationLabel,
      startYear,
      endYear,
      lossFiresPercentage: `${format('.2r')(lossFiresPercentage)}%`,
    };

    return {
      sentence,
      params,
    };
  }
);

export default createStructuredSelector({
  data: transformData,
  sentence: parseSentence,
});
