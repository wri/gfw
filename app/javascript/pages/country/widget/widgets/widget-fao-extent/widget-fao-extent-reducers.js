export const initialState = {
  isLoading: false,
  data: {},
  settings: {
    period: 1990
  }
};

const setFAOExtentIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setFAOExtentData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    ...payload
  }
});

const setFAOExtentSettingsPeriod = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    period: payload
  }
});

export default {
  setFAOExtentIsLoading,
  setFAOExtentData,
  setFAOExtentSettingsPeriod
};
