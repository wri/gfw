export const initialState = {
  isLoading: true,
  total: 0,
  years: [],
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
  locations: [
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
    },
    {
      value: 'mg',
      label: 'CO2 Emissions - mg'
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
    startYear: 2001,
    endYear: 2016,
    location: 'plantations',
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

const setTreeLossSettingsLocation = (state, { payload }) => ({
  ...state,
  settings: {
    ...state.settings,
    location: payload
  }
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
  setTreeLossSettingsLocation,
  setTreeLossSettingsUnit,
  setTreeLossSettingsCanopy,
  setTreeLossIsLoading,
  setTreeLossSettingsStartYear,
  setTreeLossSettingsEndYear
};
