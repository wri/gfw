export const initialState = {
  loading: true,
  error: false,
  config: {
    sentences: {
      initial:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
      withLoss:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of forest, equivalent to {emission} of CO₂ of emissions.',
      withPlantationLoss:
        'In 2010, {location} had {extent} of natural forest, extending over {percentage} of its land area. In {year}, it lost {loss} of natural forest, equivalent to {emission} of CO₂ of emissions.'
    }
  },
  data: {},
  settings: {
    indicator: 'gadm28',
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
