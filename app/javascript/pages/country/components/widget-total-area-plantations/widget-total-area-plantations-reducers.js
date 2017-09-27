export const initialState = {
  isLoading: true,
  plantationData: []
};

const setPieCharDataPlantations = (state, { payload }) => ({
  ...state,
  isLoading: false,
  plantationData: payload
});

export default {
  setPieCharDataPlantations
};
