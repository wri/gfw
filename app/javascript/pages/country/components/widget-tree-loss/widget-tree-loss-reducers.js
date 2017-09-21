export const initialState = {
  isLoading: true,
  minYear: 2001,
  maxYear: 2015,
  thresh: 30,
  total: 0,
  years: []
};

const setTreeLossValues = (state, { payload }) => ({
  ...state,
  isLoading: false,
  total: payload.total,
  years: payload.years
});

export default {
  setTreeLossValues
};
