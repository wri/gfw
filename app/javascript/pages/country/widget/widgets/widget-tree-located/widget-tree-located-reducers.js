export const initialState = {
  isLoading: true,
  topRegions: [],
  paginate: {
    limit: 10,
    page: 1
  },
  dataSources: [
    {
      value: 'hansen',
      label: 'Hansen - 2010'
    },
    {
      value: 'fao',
      label: 'FAO'
    }
  ],
  settings: {
    dataSource: 'hansen',
    unit: 'ha',
    canopy: 30
  }
};

const setTreeLocatedValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  topRegions: payload
});

const setTreeLocatedPage = (state, { payload }) => ({
  ...state,
  paginate: {
    ...state.paginate,
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

const setTreeLocatedSettingsCanopy = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    canopy: payload
  }
});

const setTreeLocatedIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

export default {
  setTreeLocatedValues,
  setTreeLocatedPage,
  setTreeLocatedSettingsDataSource,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsCanopy,
  setTreeLocatedIsLoading
};
