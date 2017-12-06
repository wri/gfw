export const initialState = {
  isLoading: true,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0,
  title: '',
  indicators: ['gadm28', 'wdpa', 'ifl_2013'],
  units: [
    {
      value: 'ha',
      label: 'Hectare - ha'
    },
    {
      value: '%',
      label: 'Percent Area - %'
    }
  ],
  settings: {
    indicator: 'gadm28',
    unit: 'ha',
    canopy: 30
  }
};

const setTreeCoverIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  totalCover: payload.totalCover,
  totalIntactForest: payload.totalIntactForest,
  totalNonForest: payload.totalNonForest,
  title: payload.title,
  locations: payload.locations
});

const setTreeCoverSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
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
  setTreeCoverIsLoading,
  setTreeCoverValues,
  setTreeCoverSettingsIndicator,
  setTreeCoverSettingsUnit,
  setTreeCoverSettingsCanopy
};
