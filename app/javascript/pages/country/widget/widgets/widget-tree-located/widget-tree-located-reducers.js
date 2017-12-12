export const initialState = {
  isLoading: false,
  data: {
    regions: []
  },
  settings: {
    unit: 'ha',
    indicator: 'gadm28',
    threshold: 30,
    pageSize: 10,
    page: 0
  }
};

const setTreeLocatedData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: {
    regions: payload
  },
  settings: {
    ...state.settings,
    page: 0
  }
});

const setTreeLocatedPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setTreeLocatedSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
  }
});

const setTreeLocatedSettingsUnit = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    unit: payload
  }
});

const setTreeLocatedSettingsThreshold = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    threshold: payload
  }
});

const setTreeLocatedIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

export default {
  setTreeLocatedData,
  setTreeLocatedPage,
  setTreeLocatedSettingsIndicator,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsThreshold,
  setTreeLocatedIsLoading
};
