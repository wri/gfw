export const initialState = {
  loading: false,
  error: false,
  config: {
    sentences: {
      initial:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
      withLoss:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of forest, equivalent to {emission} of CO₂ of emissions.',
      withPlantationLoss:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of forest excluding tree plantations, equivalent to {emission} of CO₂ of emissions.'
    }
  },
  data: {
    totalArea: 0,
    extent: 0,
    totalLoss: {},
    plantationsLoss: {}
  },
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
