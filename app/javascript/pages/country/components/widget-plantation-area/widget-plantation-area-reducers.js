export const initialState = {
  isLoading: true,
  plantationAreaData: [],
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
  settings: {
    unit: 'Ha',
  }
};

const setPlantationAreaData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  plantationAreaData: payload
});

export default {
  setPlantationAreaData
};
