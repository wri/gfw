export const initialState = {
  data: null
};

const globeAction = (state, { payload }) => ({
  ...state,
  data: payload
});

export default {
  globeAction
};
