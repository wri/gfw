export const initialState = {
  isLoading: true,
  minYear: 2001,
  maxYear: 2015,
  thresh: 30,
  total: 0,
  isUpdating: false,
  years: [],
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
    region: 'All',
    unit: 'Ha',
    canopy: 30
  }
};

const setTreeLossValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  total: payload.total,
  years: payload.years
});

const setTreeLossSettingsUnit = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    unit: payload
  }
});

const setTreeLossSettingsCanopy = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    canopy: payload
  }
});

const setTreeLossdIsUpdating = (state, { payload }) => ({
  ...state,
  isUpdating: payload
});

export default {
  setTreeLossValues,
  setTreeLossSettingsCanopy,
  setTreeLossdIsUpdating,
  setTreeLossSettingsUnit
};
