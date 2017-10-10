export const initialState = {
  isLoading: true,
  areaData: [],
  areaChartData: [],
  startArray: 0,
  endArray: 10,
  regions: [
    {
      label: 'Plantations',
      value: 'plantations'
    },
    {
      label: 'Managed',
      value: 'managed'
    },
    {
      label: 'Protected Areas',
      value: 'protected_areas'
    },
    {
      label: 'Intact Forest Landscapes',
      value: 'intact_forest_landscapes'
    },
    {
      label: 'Primary Forest',
      value: 'primary_forest'
    },
    {
      label: 'Mangroves',
      value: 'mangroves'
    },
    {
      label: 'Moratorium Areas',
      value: 'moratorium_areas'
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
    region: 'All',
    unit: 'Ha',
  }
};

const setPieCharDataAreas = (state, { payload }) => ({
  ...state,
  isLoading: false,
  areaData: payload
});

const setPieCharDataAreasTotal = (state, { payload }) => ({
  ...state,
  areaChartData: payload
});

const setArrayCoverAreasGain = (state, { payload }) => ({
  ...state,
  startArray: payload.startArray,
  endArray: payload.endArray
});

export default {
  setPieCharDataAreas,
  setArrayCoverAreasGain,
  setPieCharDataAreasTotal
};
