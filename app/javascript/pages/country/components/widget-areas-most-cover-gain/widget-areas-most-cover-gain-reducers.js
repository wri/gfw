export const initialState = {
  isLoading: true,
  areaData: []
};

const setPieCharDataAreas = (state, { payload }) => ({
  ...state,
  isLoading: false,
  areaData: payload
});

export default {
  setPieCharDataAreas
};
