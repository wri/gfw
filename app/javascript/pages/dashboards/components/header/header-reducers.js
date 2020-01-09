import * as actions from './header-actions';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  config: {
    sentences: {
      default:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area.',
      withLoss:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover',
      globalInitial:
        'In 2010, {location} had {extent} of tree cover, extending over {percentage} of its land area. In {year}, it lost {loss} of tree cover.',
      withPlantationLoss:
        'In 2010, {location} had {naturalForest} of natural forest, extending over {percentage} of its land area. In {year}, it lost {naturalLoss} of natural forest',
      countrySpecific: {
        IDN:
          'In 2001, {location} had {primaryForest} of primary forest*, extending over {percentagePrimaryForest} of its land area. In {year}, it lost {primaryLoss} of primary forest*, equivalent to {emissionsPrimary} of CO₂ of emissions. In 2010 {location} had {naturalForest} of natural forest**, extending over {percentageNatForest} of its land area. In <b>2018</b>, it lost {naturalLoss} of natural forest**, equivalent to {emissions} of CO₂ of emissions.'
      },
      co2Emissions: ', equivalent to {emissions} of CO\u2082 of emissions.',
      end: '.'
    }
  },
  settings: {
    threshold: 30,
    extentYear: 2010
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
  [actions.setHeaderLoading]: setHeaderLoading,
  [actions.setHeaderData]: setHeaderData
};
