export const initialState = {
  loading: false,
  error: false,
  data: {},
  config: {
    sentences: {
      initial:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
      withLoss:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover, equivalent to {emission} of CO₂ of emissions.',
      globalInitial:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover, equivalent to {emission} of CO₂ of emissions.',
      withPlantationLoss:
        'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {loss} of natural forest, equivalent to {emission} of CO₂ of emissions.',
      indoInitial:
        'In 2010, {location} had {naturalForest} of natural forest, extending over {percentageNatForest} of its land area. In {year}, it lost {treeCoverLoss} of tree cover, equivalent to {emissionsTreeCover} of CO₂ of emissions. {primaryLoss} of this loss occurred within intact and degraded primary forests and {loss} within natural forest.'
    }
  },
  settings: {
    threshold: 30
  }
};

const setHeaderLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setHeaderData = (state, { payload }) => ({
  ...state,
  data: {
    ...state.data,
    ...payload
  },
  loading: false
});

export default {
  setHeaderLoading,
  setHeaderData
};
