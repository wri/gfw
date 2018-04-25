import WIDGETS_CONFIG from '../../widget-config.json';

export const initialState = {
  loading: false,
  error: false,
  data: {},
  ...WIDGETS_CONFIG.economicImpact
};

const setEconomicImpactLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setEconomicImpactData = (state, { payload }) => ({
  ...state,
  loading: false,
  data: payload.data,
  config: {
    ...state.config,
    years: payload.years
  },
  settings: {
    ...state.settings,
    year: payload.year
  }
});

const setEconomicImpactSettings = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    ...payload
  }
});

export default {
  setEconomicImpactLoading,
  setEconomicImpactData,
  setEconomicImpactSettings
};
