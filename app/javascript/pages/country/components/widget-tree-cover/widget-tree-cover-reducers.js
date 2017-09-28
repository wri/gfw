export const initialState = {
  isLoading: true,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0,
  regions: [],
  units: [
    {
      value: 'Ha',
      name: 'Hectare - Ha',
    },
    {
      value: '%',
      name: 'Percent Area - %',
    }
  ],
  settings: {
    active: false,
    region: 'all',
    unit: 'Ha',
    canopy: 30
  }
};

const setTreeCoverValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  totalCover: payload.totalCover,
  totalIntactForest: payload.totalIntactForest,
  totalNonForest: payload.totalNonForest
});

const toggleTreeCoverSettings = (state) => ({
  ...state,
  settings: {
    ...state.settings,
    active: !state.settings.active
  }
});

export default {
  setTreeCoverValues,
  toggleTreeCoverSettings
};
