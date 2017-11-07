export const initialState = {
  isLoading: true,
  isUpdating: false,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0,
  regions: [],
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
    location: 'all',
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

const setTreeCoverSettingsLocation = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    location: payload
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
  setTreeCoverSettingsLocation,
  setTreeCoverSettingsCanopy
};
