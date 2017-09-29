export const initialState = {
  isLoading: true,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0,
  regions: [],
  units: [
    {
      value: 'Ha',
      label: 'Hectare - Ha',
    },
    {
      value: '%',
      label: 'Percent Area - %',
    }
  ],
  settings: {
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
  setTreeCoverValues,
  setTreeCoverSettingsRegion,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsCanopy
};
