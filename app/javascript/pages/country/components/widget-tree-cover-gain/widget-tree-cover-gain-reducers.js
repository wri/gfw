export const initialState = {
  isLoading: true,
  totalAmount: 0,
  percentage: 0,
  locations: [
    {
      label: 'Area-wide',
      value: 'area_wide'
    },
    {
      label: 'Protected Areas',
      value: 'protected_areas'
    }
  ],
  settings: {
    location: 'area_wide',
    locationLabel: 'Area-wide',
    canopy: 30,
    startYear: 2000,
    endYear: 2012
  }
};

const setTreeCoverGainIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverGainValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  totalAmount: payload.totalAmount,
  percentage: payload.percentage,
});

const setTreeCoverGainSettingsLocation = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    location: payload.value,
    locationLabel: payload.label
  }
});

export default {
  setTreeCoverGainIsLoading,
  setTreeCoverGainValues,
  setTreeCoverGainSettingsLocation
};
