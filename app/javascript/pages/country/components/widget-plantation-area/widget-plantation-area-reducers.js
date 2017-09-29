export const initialState = {
  isLoading: true,
  plantationAreaData: []
};

const setPlantationAreaData = (state, { payload }) => ({
  ...state,
  isLoading: false,
  plantationAreaData: payload
});

export default {
  setPlantationAreaData
};
