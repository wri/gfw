export const initialState = {
  isLoading: true,
  areaData: [],
  areaChartData: [],
  paginate: {
    limit: 10,
    page: 1
  },
  locations: [
    {
      value: 'all',
      label: 'All Region'
    },
    {
      value: 'managed',
      label: 'Managed'
    },
    {
      value: 'protected_areas',
      label: 'Protected Areas'
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
  settings: {
    location: 'all',
    locationLabel: 'All Region',
    unit: 'Ha',
    canopy: 30,
    startYear: 2011,
    endYear: 2015
  }
};

const setAreasMostCoverIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setAreasMostCoverGainValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  areaData: payload.data,
  areaChartData: payload.charData
});


const setAreasMostCoverGainSettingsLocation = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    location: payload.value,
    locationLabel: payload.label
  }
});

const setAreasMostCoverGainSettingsUnit = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    unit: payload
  }
});

const setAreasMostCoverGainPage = (state, { payload }) => ({
  ...state,
  paginate: {
    ...state.paginate,
    page: payload
  }
});

export default {
  setAreasMostCoverIsLoading,
  setAreasMostCoverGainValues,
  setAreasMostCoverGainSettingsLocation,
  setAreasMostCoverGainSettingsUnit,
  setAreasMostCoverGainPage
};
