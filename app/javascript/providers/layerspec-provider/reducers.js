export const initialState = {
  loading: false,
  error: false,
  data: {}
};

const setLayerSpecLoading = (state, { payload }) => ({
  ...state,
  ...payload
});

const setLayers = (state, { payload }) => ({
  ...state,
  data: payload,
  loading: false
});

export default {
  setLayers,
  setLayerSpecLoading
};
