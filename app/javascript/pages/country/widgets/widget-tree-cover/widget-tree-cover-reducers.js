export const initialState = {
  isLoading: false,
  totalCover: 0,
  totalIntactForest: 0,
  totalNonForest: 0,
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

const setTreeLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverData = (state, { payload }) => ({
  ...state,
  ...payload
});

const setCoverCountryArea = (state, { payload }) => ({
  ...state,
  areas: {
    ...state.areas,
    country: payload
  }
});

const setCoverRegionArea = (state, { payload }) => ({
  ...state,
  areas: {
    ...state.areas,
    region: payload
  }
});

const setCoverSubRegionArea = (state, { payload }) => ({
  ...state,
  areas: {
    ...state.areas,
    subRegion: payload
  }
});

// const setTreeCoverSettingsLocation = (state, { payload }) => ({
//   ...state,
//   settings: {
//     ...state.settings,
//     location: payload.value,
//     locationLabel: payload.label
//   }
// });

// const setTreeCoverSettingsUnit = (state, { payload }) => ({
//   ...state,
//   settings: {
//     ...state.settings,
//     unit: payload
//   }
// });

// const setTreeCoverSettingsCanopy = (state, { payload }) => ({
//   ...state,
//   settings: {
//     ...state.settings,
//     canopy: payload
//   }
// });

export default {
  setTreeLoading,
  setTreeCoverData,
  setCoverCountryArea,
  setCoverRegionArea,
  setCoverSubRegionArea
  // setTreeCoverSettingsLocation,
  // setTreeCoverSettingsUnit,
  // setTreeCoverSettingsCanopy
};
