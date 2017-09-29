export const initialState = {
  isLoading: true,
  isUpdating: false,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0,
  regions: [],
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
    region: 'all',
    unit: 'Ha',
    canopy: 30
  }
};

const setTreeCoverIsUpdating = (state, { payload }) => ({
  ...state,
  isUpdating: payload
});

const setTreeCoverValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  isUpdating: false,
  totalCover: payload.totalCover,
  totalIntactForest: payload.totalIntactForest,
  totalNonForest: payload.totalNonForest,
  regions: payload.regions
});

const setTreeCoverSettingsRegion = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    region: payload
  }
});

const setTreeCoverSettingsUnit = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    unit: payload
  }
});

const setTreeCoverSettingsCanopy = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    canopy: payload
  }
});

export default {
  setTreeCoverIsUpdating,
  setTreeCoverValues,
  setTreeCoverSettingsRegion,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsCanopy
};
