export const initialState = {
  isLoading: true,
  data: {
    topRegions: []
  },
  settings: {
    dataSource: 'hansen',
    unit: 'ha',
    threshold: 30,
    pageSize: 10,
    page: 0
  }
};

const setTreeLocatedData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  data: payload
});

const setTreeLocatedPage = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    page: payload
  }
});

const setTreeLocatedSettingsDataSource = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    dataSource: payload
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
  setTreeLocatedSettingsDataSource,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsThreshold,
  setTreeLocatedIsLoading
};
