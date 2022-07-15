import { createSelector, createStructuredSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import { format } from 'd3-format';

// get list data
const getLoss = (state) => state.data && state.data.loss;
const getSettings = (state) => state.settings;
const getLocationLabel = (state) => state.locationLabel;
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
  [parseData, getSettings, getLocationLabel, getSentence],
  (data, settings, locationLabel, sentences) => {
    if (!data) return null;
    const { initial, noLoss } = sentences;
    const { startYear, endYear } = settings;
    const { treeCoverLoss, treeCoverLossFires } = data;

    const lossFiresPercentage = (treeCoverLossFires * 100) / treeCoverLoss;
    let sentence = initial;
    if (treeCoverLossFires === 0) {
      sentence = noLoss;
    }

    const params = {
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
