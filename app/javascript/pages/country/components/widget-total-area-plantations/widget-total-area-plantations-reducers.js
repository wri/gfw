export const initialState = {
  isLoading: true,
  plantationData: [],
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

const setPieCharDataPlantations = (state, { payload }) => ({
  ...state,
  isLoading: false,
  plantationData: payload
});

export default {
  setPieCharDataPlantations
};
