export const initialState = {
  isLoading: true,
  topRegions: [],
  startArray: 0,
  endArray: 10,
  dataSource: [
    {
      value: '',
      label: 'Hansen - 2010'
    },
    {
      value: '',
      label: 'FAO'
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
    dataSources: 'All',
    unit: 'Ha',
    canopy: 30
  }
};

const setTreeLocatedValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  topRegions: payload
});

const setArrayLocated = (state, { payload }) => ({
  ...state,
  startArray: payload.startArray,
  endArray: payload.endArray
});

export default {
  setTreeLocatedValues,
  setArrayLocated
};
