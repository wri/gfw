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
  units: [
    {
      value: 'Ha',
      label: 'Hectare - Ha'
    },
    {
      value: '%',
      label: 'Percent Area - %'
    }
  ],
  canopies: [
    {
      value: 0,
      label: '> 0%'
    },
    {
      value: 10,
      label: '> 10%'
    },
    {
      value: 15,
      label: '> 15%'
    },
    {
      value: 20,
      label: '> 20%'
    },
    {
      value: 25,
      label: '> 25%'
    },
    {
      value: 30,
      label: '> 30%'
    },
    {
      value: 50,
      label: '> 50%'
    },
    {
      value: 75,
      label: '> 75%'
    }
  ],
  settings: {
    dataSource: 'hansen',
    unit: 'Ha',
    canopy: 30
  }
};

const setTreeLocatedValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  topRegions: payload
});

const setTreeLocatedArrayLocated = (state, { payload }) => ({
  ...state,
  startArray: payload.startArray,
  endArray: payload.endArray
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
  setTreeLocatedArrayLocated,
  setTreeLocatedPage,
  setTreeLocatedSettingsDataSource,
  setTreeLocatedSettingsUnit,
  setTreeLocatedSettingsCanopy,
  setTreeLocatedIsLoading
};
