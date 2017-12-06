export const initialState = {
  isLoading: true,
  loss: [],
  lossSentence: '',
  treeExtent: 0,
  yearsLoss: [
    {
      label: '2001',
      value: 2001
    },
    {
      label: '2002',
      value: 2002
    },
    {
      label: '2003',
      value: 2003
    },
    {
      label: '2004',
      value: 2004
    },
    {
      label: '2005',
      value: 2005
    },
    {
      label: '2006',
      value: 2006
    },
    {
      label: '2007',
      value: 2007
    },
    {
      label: '2008',
      value: 2008
    },
    {
      label: '2009',
      value: 2009
    },
    {
      label: '2010',
      value: 2010
    },
    {
      label: '2011',
      value: 2011
    },
    {
      label: '2012',
      value: 2012
    },
    {
      label: '2013',
      value: 2013
    },
    {
      label: '2014',
      value: 2014
    },
    {
      label: '2015',
      value: 2015
    },
    {
      label: '2016',
      value: 2016
    }
  ],
  indicators: [
    {
      label: 'All Regions',
      value: 'gadm28_only'
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
      label: 'Protected Areas',
      value: 'wdpa'
    },
    {
      label: 'Intact Forest Landscapes (2000)',
      value: 'IFL_2000'
    },
    {
      label: 'Intact Forest Landscapes (2013)',
      value: 'IFL_2013'
    },
    {
      label: 'Primary Forest',
      value: 'primary_forests'
    }
  ],
  settings: {
    startYear: 2001,
    endYear: 2016,
    indicator: 'gadm28_only',
    canopy: 30
  }
};

const setTreeLossValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  loss: payload.loss,
  lossSentence: payload.lossSentence,
  treeExtent: payload.treeExtent
});

const setTreeLossSettingsIndicator = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    indicator: payload
  }
});

const setTreeLossSettingsCanopy = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    canopy: payload
  }
});

const setTreeLossIsLoading = (state, { payload }) => ({
  ...state,
  isLoading: payload
});

const setTreeLossSettingsStartYear = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    startYear: payload
  }
});

const setTreeLossSettingsEndYear = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    endYear: payload
  }
});

export default {
  setTreeLossValues,
  setTreeLossSettingsIndicator,
  setTreeLossSettingsCanopy,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear
};
