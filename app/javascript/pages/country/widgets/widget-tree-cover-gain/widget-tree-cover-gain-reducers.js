export const initialState = {
  isLoading: true,
  gain: 0,
  treeExtent: 0,
  indicators: [
    {
      label: 'All Regions',
      value: 'gadm28_only'
    },
    {
      label: 'Biodiversity Hotspots',
      value: 'biodiversity_hot_spots'
    },
    {
      label: 'Protected Areas',
      value: 'wdpa'
    },
    {
      label: 'Tree Plantations',
      value: 'gfw_plantations'
    },
    {
      label: 'Managed',
      value: 'gfw_managed_forests'
    },
    {
      label: 'Intact Forest Landscapes (2000)',
      value: 'IFL_2000'
    },
    {
      label: 'Intact Forest Landscapes (2013)',
      value: 'IFL_2013'
    }
  ],
  settings: {
    indicator: 'gadm28_only'
  }
};

const setTreeCoverGainIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeCoverGainValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  gain: payload.gain,
  treeExtent: payload.treeExtent
});

const setTreeCoverGainSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
  }
});

export default {
  setTreeCoverGainIsLoading,
  setTreeCoverGainValues,
  setTreeCoverGainSettingsIndicator
};
